#!/bin/sh
export VAULT_ADDR=http://0.0.0.0:8200
vault server -dev -dev-root-token-id=root -dev-listen-address=0.0.0.0:8200 > /vault.log 2>&1 &
VAULT_PID=$!
echo "Vault PID: $VAULT_PID"
MAX_ATTEMPTS=30
ATTEMPT=0
until vault status; do
echo "Waiting for Vault to be ready (attempt $((ATTEMPT + 1))/$MAX_ATTEMPTS)..."
curl -fs http://0.0.0.0:8200/v1/sys/health || echo "curl health check failed: $?"
sleep 1
ATTEMPT=$((ATTEMPT + 1))
if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
echo "Timeout waiting for Vault to be ready"
cat /vault.log
kill $VAULT_PID
exit 1
fi
done
echo "Vault is ready, creating secret..."
vault kv put secret/users/user1@example.com message="Hello Matt!"
kill $VAULT_PID
echo "Vault logs:"
cat /vault.log
exit 0
