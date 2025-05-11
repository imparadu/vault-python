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
echo "Vault is ready, creating secret..."
/bin/vault kv put secret/users/user1@example.com message="Hello Matt!"
# Keep the server running
wait $VAULT_PID
