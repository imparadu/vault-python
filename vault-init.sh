#!/bin/sh
export VAULT_ADDR=http://127.0.0.1:8200
# Verify vault binary
if [ ! -x /bin/vault ]; then
  echo "Error: /bin/vault not found or not executable"
  exit 1
fi
# Start Vault server and log to /tmp
echo "Starting Vault server..."
/bin/vault server -dev -dev-root-token-id=root -dev-listen-address=0.0.0.0:8200 > /tmp/vault.log 2>&1 &
VAULT_PID=$!
echo "Vault PID: $VAULT_PID"
# Wait for Vault to be ready with timeout
MAX_ATTEMPTS=30
ATTEMPT=0
until curl -fs http://127.0.0.1:8200/v1/sys/health > /dev/null 2>&1; do
  echo "Waiting for Vault to be ready (attempt $((ATTEMPT + 1))/$MAX_ATTEMPTS)..."
  curl -fs http://127.0.0.1:8200/v1/sys/health || echo "curl health check failed: $?"
  sleep 1
  ATTEMPT=$((ATTEMPT + 1))
  if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo "Timeout waiting for Vault to be ready"
    cat /tmp/vault.log
    kill $VAULT_PID
    exit 1
  fi
done
echo "Vault is ready, configuring JWT auth and secrets..."
# Install openssl for key conversion
apk add --no-cache --no-check-certificate openssl
# Fetch JWKS manually
JWKS=$(curl -k https://dev-93127078.okta.com/oauth2/default/v1/keys)
if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch JWKS"
  cat /tmp/vault.log
  kill $VAULT_PID
  exit 1
fi
# Extract modulus (n) and exponent (e) from JWKS
N=$(echo "$JWKS" | jq -r '.keys[0].n')
E=$(echo "$JWKS" | jq -r '.keys[0].e')
if [ -z "$N" ] || [ -z "$E" ]; then
  echo "Error: Failed to extract n or e from JWKS"
  cat /tmp/vault.log
  kill $VAULT_PID
  exit 1
fi
# Convert base64url to base64 and add padding
N_B64=$(echo "$N" | tr '_-' '/+' | sed -E 's/.{0,2}$/&==/g')
E_B64=$(echo "$E" | tr '_-' '/+' | sed -E 's/.{0,2}$/&==/g')
# Create DER file manually
N_BIN=$(echo "$N_B64" | base64 -d | xxd -p -c 256 | tr -d '\n')
E_BIN=$(echo "$E_B64" | base64 -d | xxd -p -c 256 | tr -d '\n')
if [ -z "$N_BIN" ] || [ -z "$E_BIN" ]; then
  echo "Error: Failed to decode base64 to binary"
  cat /tmp/vault.log
  kill $VAULT_PID
  exit 1
fi
N_LEN=$(printf "%04x" $(echo "$N_B64" | base64 -d | wc -c) | sed 's/\(..\)\(..\)/\1 \2/')
E_LEN=$(printf "%02x" $(echo "$E_B64" | base64 -d | wc -c) | sed 's/\(..\)/\1/')
DER_HEX="30 $(printf "%02x" $((4 + $(echo "$N_B64" | base64 -d | wc -c) + $(echo "$E_B64" | base64 -d | wc -c))) | sed 's/\(..\)/\1/') 02 $N_LEN $N_BIN 02 $E_LEN $E_BIN"
DER=$(echo "$DER_HEX" | xxd -r -p | base64)
if [ -z "$DER" ]; then
  echo "Error: Failed to generate DER hex"
  cat /tmp/vault.log
  kill $VAULT_PID
  exit 1
fi
# Convert DER to PEM using openssl
PUBKEY=$(echo "$DER" | base64 -d | openssl rsa -pubin -inform DER -outform PEM 2>/dev/null | sed '/^-----/!s/^/  /')
if [ $? -ne 0 ] || [ -z "$PUBKEY" ]; then
  echo "Error: Failed to convert DER to PEM format"
  cat /tmp/vault.log
  kill $VAULT_PID
  exit 1
fi
# Enable JWT auth method
/bin/vault auth enable jwt
# Configure JWT auth with static public key
/bin/vault write auth/jwt/config \
    jwt_validation_pubkeys="$PUBKEY" \
    default_role="okta-user"
# Create JWT role
/bin/vault write auth/jwt/role/okta-user \
    role_type="jwt" \
    bound_audiences="api://default" \
    user_claim="sub" \
    groups_claim="groups" \
    token_policies="default" \
    policies="default" \
    claim_mappings="groups=okta_groups"
# Create policies
/bin/vault policy write tier1-policy - <<EOF
path "secret/data/restricted/api-keys/api-key1" {
  capabilities = ["read"]
}
path "secret/data/restricted/db-creds/db-user1" {
  capabilities = ["read"]
}
path "secret/metadata/restricted/api-keys/*" {
  capabilities = ["list"]
}
path "secret/metadata/restricted/db-creds/*" {
  capabilities = ["list"]
}
EOF
/bin/vault policy write tier2-policy - <<EOF
path "secret/data/restricted/api-keys/api-key2" {
  capabilities = ["read"]
}
path "secret/data/restricted/db-creds/db-user2" {
  capabilities = ["read"]
}
path "secret/data/restricted/config/app-config" {
  capabilities = ["read"]
}
path "secret/metadata/restricted/api-keys/*" {
  capabilities = ["list"]
}
path "secret/metadata/restricted/db-creds/*" {
  capabilities = ["list"]
}
path "secret/metadata/restricted/config/*" {
  capabilities = ["list"]
}
EOF
# Create external identity groups
/bin/vault write identity/group type="external" name="tier1-group" policies="tier1-policy"
/bin/vault write identity/group type="external" name="tier2-group" policies="tier2-policy"
# Get mount_accessor
MOUNT_ACCESSOR=$(/bin/vault auth list -format=json | jq -r '.["jwt/"].accessor')
TIER1_GROUP_ID=$(/bin/vault read -field=id identity/group/name/tier1-group)
TIER2_GROUP_ID=$(/bin/vault read -field=id identity/group/name/tier2-group)
# Map Okta groups to identity groups
/bin/vault write identity/group-alias name="tier1" \
    mount_accessor="$MOUNT_ACCESSOR" \
    canonical_id="$TIER1_GROUP_ID"
/bin/vault write identity/group-alias name="tier2" \
    mount_accessor="$MOUNT_ACCESSOR" \
    canonical_id="$TIER2_GROUP_ID"
# Create secrets
/bin/vault kv put secret/restricted/api-keys/api-key1 key="api-key-123"
/bin/vault kv put secret/restricted/api-keys/api-key2 key="api-key-456"
/bin/vault kv put secret/restricted/db-creds/db-user1 username="db-user1" password="db-pass1"
/bin/vault kv put secret/restricted/db-creds/db-user2 username="db-user2" password="db-pass2"
/bin/vault kv put secret/restricted/config/app-config setting="config-value"
# Keep the server running
wait $VAULT_PID
