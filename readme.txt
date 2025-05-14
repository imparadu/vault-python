vault-1     | Starting Vault server...
vault-1     | Vault PID: 18
vault-1     | Waiting for Vault to be ready (attempt 1/30)...
vault-1     | curl health check failed: 7
frontend-1  |
frontend-1  | > frontend@0.1.0 start
frontend-1  | > react-scripts start
frontend-1  |
vault-1     | Vault is ready, configuring JWT auth and secrets...
vault-1     | fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz
vault-1     | fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/APKINDEX.tar.gz
vault-1     | (1/3) Upgrading libcrypto3 (3.1.2-r0 -> 3.1.8-r0)
vault-1     | (2/3) Upgrading libssl3 (3.1.2-r0 -> 3.1.8-r0)
vault-1     | (3/3) Installing openssl (3.1.8-r0)
vault-1     | Executing busybox-1.36.1-r2.trigger
vault-1     | Executing ca-certificates-20241121-r1.trigger
vault-1     | OK: 17 MiB in 32 packages
vault-1     |   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
vault-1     |                                  Dload  Upload   Total   Spent    Left  Speed
frontend-1  | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
frontend-1  | (Use `node --trace-deprecation ...` to show where the warning was created)
frontend-1  | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
frontend-1  | Starting the development server...
frontend-1  |
100   462    0   462    0     0    357      0 --:--:--  0:00:01 --:--:--   358
vault-1     | Error: Failed to convert DER to PEM format
vault-1     | ==> Vault server configuration:
vault-1     |
vault-1     | Administrative Namespace:
vault-1     |              Api Address: http://0.0.0.0:8200
vault-1     |                      Cgo: disabled
vault-1     |          Cluster Address: https://0.0.0.0:8201
vault-1     |    Environment Variables: GODEBUG, HOME, HOSTNAME, NAME, OKTA_API_TOKEN, PATH, PWD, SHLVL, VAULT_ADDR, VAULT_DEV_LISTEN_ADDRESS, VAULT_DEV_ROOT_TOKEN_ID, VERSION
vault-1     |               Go Version: go1.21.1
vault-1     |               Listener 1: tcp (addr: "0.0.0.0:8200", cluster address: "0.0.0.0:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
vault-1     |                Log Level:
vault-1     |                    Mlock: supported: true, enabled: false
vault-1     |            Recovery Mode: false
vault-1     |                  Storage: inmem
vault-1     |                  Version: Vault v1.15.0, built 2023-09-22T16:53:10Z
vault-1     |              Version Sha: b4d07277a6c5318bb50d3b94bbd6135dccb4c601
vault-1     |
vault-1     | ==> Vault server started! Log data will stream in below:
vault-1     |
vault-1     | 2025-05-14T16:50:23.762Z [INFO]  proxy environment: http_proxy="" https_proxy="" no_proxy=""
vault-1     | 2025-05-14T16:50:23.763Z [INFO]  incrementing seal generation: generation=1
vault-1     | 2025-05-14T16:50:23.763Z [WARN]  no `api_addr` value specified in config or in VAULT_API_ADDR; falling back to detection if possible, but this value should be manually set
vault-1     | 2025-05-14T16:50:23.764Z [INFO]  core: Initializing version history cache for core
vault-1     | 2025-05-14T16:50:23.764Z [INFO]  events: Starting event system
vault-1     | 2025-05-14T16:50:23.765Z [INFO]  core: security barrier not initialized
vault-1     | 2025-05-14T16:50:23.765Z [INFO]  core: security barrier initialized: stored=1 shares=1 threshold=1
vault-1     | 2025-05-14T16:50:23.766Z [INFO]  core: post-unseal setup starting
vault-1     | 2025-05-14T16:50:23.774Z [INFO]  core: loaded wrapping token key
vault-1     | 2025-05-14T16:50:23.774Z [INFO]  core: successfully setup plugin runtime catalog
vault-1     | 2025-05-14T16:50:23.774Z [INFO]  core: successfully setup plugin catalog: plugin-directory=""
vault-1     | 2025-05-14T16:50:23.774Z [INFO]  core: no mounts; adding default mount table
vault-1     | 2025-05-14T16:50:23.776Z [INFO]  core: successfully mounted: type=cubbyhole version="v1.15.0+builtin.vault" path=cubbyhole/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:23.777Z [INFO]  core: successfully mounted: type=system version="v1.15.0+builtin.vault" path=sys/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:23.777Z [INFO]  core: successfully mounted: type=identity version="v1.15.0+builtin.vault" path=identity/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:23.784Z [INFO]  core: successfully mounted: type=token version="v1.15.0+builtin.vault" path=token/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:23.784Z [INFO]  rollback: Starting the rollback manager with 256 workers
vault-1     | 2025-05-14T16:50:23.784Z [INFO]  rollback: starting rollback manager
vault-1     | 2025-05-14T16:50:23.784Z [INFO]  core: restoring leases
vault-1     | 2025-05-14T16:50:23.786Z [INFO]  expiration: lease restore complete
vault-1     | 2025-05-14T16:50:23.789Z [INFO]  identity: entities restored
vault-1     | 2025-05-14T16:50:23.789Z [INFO]  identity: groups restored
vault-1     | 2025-05-14T16:50:23.789Z [INFO]  core: Recorded vault version: vault version=1.15.0 upgrade time="2025-05-14 16:50:23.78923341 +0000 UTC" build date=2023-09-22T16:53:10Z
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core: post-unseal setup complete
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core: root token generated
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core: pre-seal teardown starting
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  rollback: stopping rollback manager
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core: pre-seal teardown complete
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core.cluster-listener.tcp: starting listener: listener_address=0.0.0.0:8201
vault-1     | 2025-05-14T16:50:24.096Z [INFO]  core.cluster-listener: serving cluster requests: cluster_listen_address=[::]:8201
vault-1     | 2025-05-14T16:50:24.097Z [INFO]  core: post-unseal setup starting
vault-1     | 2025-05-14T16:50:24.097Z [INFO]  core: loaded wrapping token key
vault-1     | 2025-05-14T16:50:24.097Z [INFO]  core: successfully setup plugin runtime catalog
vault-1     | 2025-05-14T16:50:24.097Z [INFO]  core: successfully setup plugin catalog: plugin-directory=""
vault-1     | 2025-05-14T16:50:24.100Z [INFO]  core: successfully mounted: type=system version="v1.15.0+builtin.vault" path=sys/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:24.101Z [INFO]  core: successfully mounted: type=identity version="v1.15.0+builtin.vault" path=identity/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:24.101Z [INFO]  core: successfully mounted: type=cubbyhole version="v1.15.0+builtin.vault" path=cubbyhole/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:24.102Z [INFO]  core: successfully mounted: type=token version="v1.15.0+builtin.vault" path=token/ namespace="ID: root. Path: "
vault-1     | 2025-05-14T16:50:24.102Z [INFO]  rollback: Starting the rollback manager with 256 workers
vault-1     | 2025-05-14T16:50:24.102Z [INFO]  rollback: starting rollback manager
vault-1     | 2025-05-14T16:50:24.103Z [INFO]  core: restoring leases
vault-1     | 2025-05-14T16:50:24.103Z [INFO]  identity: entities restored
vault-1     | 2025-05-14T16:50:24.103Z [INFO]  identity: groups restored
vault-1     | 2025-05-14T16:50:24.104Z [INFO]  expiration: lease restore complete
vault-1     | 2025-05-14T16:50:24.104Z [INFO]  core: post-unseal setup complete
vault-1     | 2025-05-14T16:50:24.104Z [INFO]  core: vault is unsealed
vault-1     | 2025-05-14T16:50:24.109Z [INFO]  expiration: revoked lease: lease_id=auth/token/root/h22f8136a9ce5e07677339ec961683091e96fc57186f2661fe1b9b04c063eb905
vault-1     | 2025-05-14T16:50:24.116Z [INFO]  core: successful mount: namespace="" path=secret/ type=kv version=""
vault-1     | WARNING! dev mode is enabled! In this mode, Vault runs entirely in-memory
vault-1     | and starts unsealed with a single unseal key. The root token is already
vault-1     | authenticated to the CLI, so you can immediately begin using Vault.
vault-1     |
vault-1     | You may need to set the following environment variables:
vault-1     |
vault-1     |     $ export VAULT_ADDR='http://0.0.0.0:8200'
vault-1     |
vault-1     | The unseal key and root token are displayed below in case you want to
vault-1     | seal/unseal the Vault or re-authenticate.
vault-1     |
vault-1     | Unseal Key: PDywCgjLKYCPxjUeNQLoKYwsA5uhTCxm/fpNf3YjrZM=
vault-1     | Root Token: root
vault-1     |
vault-1     | Development mode should NOT be used in production installations!
vault-1     |
Gracefully stopping... (press Ctrl+C again to force)
dependency failed to start: container vault-python-vault-1 exited (1)
~/temp-clone/vault-python master ❯                                                                                        1m 2s
