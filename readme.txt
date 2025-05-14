~/temp-clone/vault-python master ❯ docker logs vault-python-vault-1
Starting Vault server...
Vault PID: 20
Waiting for Vault to be ready (attempt 1/30)...
curl health check failed: 7
Vault is ready, configuring JWT auth and secrets...
Success! Enabled jwt auth method at: jwt/
Error writing data to auth/jwt/config: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/auth/jwt/config
Code: 400. Errors:

* error checking oidc discovery URL
Success! Data written to: auth/jwt/role/okta-user
Success! Uploaded policy: tier1-policy
Success! Uploaded policy: tier2-policy
Key     Value
---     -----
id      ea99ff17-4d60-b987-f81b-3e533ae55dee
name    tier1-group
Key     Value
---     -----
id      cd7cd3b3-b439-ef55-a280-b044d745d204
name    tier2-group
Key             Value
---             -----
canonical_id    ea99ff17-4d60-b987-f81b-3e533ae55dee
id              b5e0f350-b6df-4a80-930b-fa805b1be6ca
Key             Value
---             -----
canonical_id    cd7cd3b3-b439-ef55-a280-b044d745d204
id              c50a988f-9482-3008-e38a-8a6e5cfc509d
============== Secret Path ==============
secret/data/restricted/api-keys/api-key1

======= Metadata =======
Key                Value
---                -----
created_time       2025-05-14T14:54:17.993105483Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
============== Secret Path ==============
secret/data/restricted/api-keys/api-key2

======= Metadata =======
Key                Value
---                -----
created_time       2025-05-14T14:54:18.136521617Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
============== Secret Path ==============
secret/data/restricted/db-creds/db-user1

======= Metadata =======
Key                Value
---                -----
created_time       2025-05-14T14:54:18.238595602Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
============== Secret Path ==============
secret/data/restricted/db-creds/db-user2

======= Metadata =======
Key                Value
---                -----
created_time       2025-05-14T14:54:18.357581714Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
============== Secret Path ==============
secret/data/restricted/config/app-config

======= Metadata =======
Key                Value
---                -----
created_time       2025-05-14T14:54:18.459228034Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
~/temp-clone/vault-python master ❯
