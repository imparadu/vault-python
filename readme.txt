vault-1     | Starting Vault server...
vault-1     | Vault PID: 22
vault-1     | Waiting for Vault to be ready (attempt 1/30)...
vault-1     | curl health check failed: 7
frontend-1  |
frontend-1  | > frontend@0.1.0 start
frontend-1  | > react-scripts start
frontend-1  |
vault-1     | Vault is ready, configuring JWT auth and secrets...
vault-1     | Success! Enabled jwt auth method at: jwt/
vault-1     | Error writing data to auth/jwt/config: Error making API request.
vault-1     |
vault-1     | URL: PUT http://127.0.0.1:8200/v1/auth/jwt/config
vault-1     | Code: 400. Errors:
vault-1     |
vault-1     | * error checking jwks URL
vault-1     | Success! Data written to: auth/jwt/role/okta-user
vault-1     | Success! Uploaded policy: tier1-policy
vault-1     | Success! Uploaded policy: tier2-policy
vault-1     | Key     Value
vault-1     | ---     -----
vault-1     | id      45993dda-6509-795e-9100-8e3b73330e68
vault-1     | name    tier1-group
vault-1     | Key     Value
vault-1     | ---     -----
vault-1     | id      32823a10-2600-abdf-7fcc-cba5bdb17405
vault-1     | name    tier2-group
frontend-1  | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
frontend-1  | (Use `node --trace-deprecation ...` to show where the warning was created)
frontend-1  | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
vault-1     | Key             Value
vault-1     | ---             -----
vault-1     | canonical_id    45993dda-6509-795e-9100-8e3b73330e68
vault-1     | id              20ed2b77-7182-3d13-b6c5-d69d24455683
vault-1     | Key             Value
vault-1     | ---             -----
vault-1     | canonical_id    32823a10-2600-abdf-7fcc-cba5bdb17405
vault-1     | id              7fe280a2-55fb-957f-a8d2-02324f610f1b
vault-1     | ============== Secret Path ==============
vault-1     | secret/data/restricted/api-keys/api-key1
vault-1     |
vault-1     | ======= Metadata =======
vault-1     | Key                Value
vault-1     | ---                -----
vault-1     | created_time       2025-05-14T15:57:24.828436345Z
vault-1     | custom_metadata    <nil>
vault-1     | deletion_time      n/a
vault-1     | destroyed          false
vault-1     | version            1
vault-1     | ============== Secret Path ==============
vault-1     | secret/data/restricted/api-keys/api-key2
vault-1     |
vault-1     | ======= Metadata =======
vault-1     | Key                Value
vault-1     | ---                -----
vault-1     | created_time       2025-05-14T15:57:24.922475256Z
vault-1     | custom_metadata    <nil>
vault-1     | deletion_time      n/a
vault-1     | destroyed          false
vault-1     | version            1
frontend-1  | Starting the development server...
frontend-1  |
vault-1     | ============== Secret Path ==============
vault-1     | secret/data/restricted/db-creds/db-user1
vault-1     |
vault-1     | ======= Metadata =======
vault-1     | Key                Value
vault-1     | ---                -----
vault-1     | created_time       2025-05-14T15:57:25.008718101Z
vault-1     | custom_metadata    <nil>
vault-1     | deletion_time      n/a
vault-1     | destroyed          false
vault-1     | version            1
vault-1     | ============== Secret Path ==============
vault-1     | secret/data/restricted/db-creds/db-user2
vault-1     |
vault-1     | ======= Metadata =======
vault-1     | Key                Value
vault-1     | ---                -----
vault-1     | created_time       2025-05-14T15:57:25.140913156Z
vault-1     | custom_metadata    <nil>
vault-1     | deletion_time      n/a
vault-1     | destroyed          false
vault-1     | version            1
vault-1     | ============== Secret Path ==============
vault-1     | secret/data/restricted/config/app-config
vault-1     |
vault-1     | ======= Metadata =======
vault-1     | Key                Value
vault-1     | ---                -----
vault-1     | created_time       2025-05-14T15:57:25.237396333Z
vault-1     | custom_metadata    <nil>
vault-1     | deletion_time      n/a
vault-1     | destroyed          false
vault-1     | version            1
backend-1   |  * Serving Flask app 'app' (lazy loading)
backend-1   |  * Environment: production
backend-1   |    WARNING: This is a development server. Do not use it in a production deployment.
backend-1   |    Use a production WSGI server instead.
backend-1   |  * Debug mode: on
backend-1   |  * Tip: There are .env or .flaskenv files present. Do "pip install python-dotenv" to use them.
backend-1   | WARNING:werkzeug: * Running on all addresses.
backend-1   |    WARNING: This is a development server. Do not use it in a production deployment.
backend-1   | INFO:werkzeug: * Running on http://172.21.0.4:3001/ (Press CTRL+C to quit)
backend-1   | INFO:werkzeug: * Restarting with stat
backend-1   |  * Tip: There are .env or .flaskenv files present. Do "pip install python-dotenv" to use them.
backend-1   | WARNING:werkzeug: * Debugger is active!
backend-1   | INFO:werkzeug: * Debugger PIN: 141-250-170
frontend-1  | Compiled successfully!
frontend-1  |
frontend-1  | You can now view frontend in the browser.
frontend-1  |
frontend-1  |   Local:            http://localhost:3000
frontend-1  |   On Your Network:  http://172.21.0.3:3000
frontend-1  |
frontend-1  | Note that the development build is not optimized.
frontend-1  | To create a production build, use npm run build.
frontend-1  |
frontend-1  | webpack compiled successfully
frontend-1  | No issues found.
frontend-1  | Compiling...
frontend-1  | Compiled successfully!
frontend-1  | webpack compiled successfully
frontend-1  | No issues found.
backend-1   | INFO:werkzeug:192.168.65.1 - - [14/May/2025 15:58:39] "OPTIONS /secrets HTTP/1.1" 200 -
backend-1   | INFO:werkzeug:192.168.65.1 - - [14/May/2025 15:58:39] "OPTIONS /secrets HTTP/1.1" 200 -
backend-1   | INFO:root:Received Authorization header: Bearer eyJraWQiOiJVd0RzVElGNnZsQ2QyVU8xOVB2LVpEdEdFdk51anZMX3hxWUNrUUtTcUl3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnB0eWN4TWZQa1EwWkxIbjRVcXZ4ME5qNEk2cTdwWGI1NzVtaFZDLUg4TUkiLCJpc3MiOiJodHRwczovL2Rldi05MzEyNzA3OC5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE3NDcyMzgzMTksImV4cCI6MTc0NzI0MTkxOSwiY2lkIjoiMG9hb3BsMm02cHB6eGtKWDI1ZDciLCJ1aWQiOiIwMHVvcGxjYm42eW5tcXR0WTVkNyIsInNjcCI6WyJncm91cHMiLCJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiYXV0aF90aW1lIjoxNzQ3MjM4MzE3LCJzdWIiOiJwZWRyb0BleGFtcGxlLmNvbSIsImdyb3VwcyI6WyJFdmVyeW9uZSIsInRpZXIxIl19.QQRQbOiBqxALZQUQNjIdbhFiwnj4ZvYhrqGCxZYsJLL9RKfmjEQ5nKEPnnwgMchJpLvowGUoCkN6rWamHckr3CZjAvdPrcMxNFQmp0Kd7q9mQXjl7SGW4kbrUKlP2xdkLATYZI-ZNklOFnDilR_g14mP4btg8Kgf3vDxl3PFS5HqnisChXg1C-jaTx7M_Eq9USkKPL16zCjnZLDmSdh7DImgbd9VO87TBXkJ0uG669pJa4C0TLBFsqfltk3foG21uYuiR9UAuw4dP5vb_yBSjeE7pLZ_UJkbLlE-y0tOyGYLcW0JKhtepSJuxPfRwPEkXu17nxJDinUpPAH5izEdrA
backend-1   | INFO:root:Received Authorization header: Bearer eyJraWQiOiJVd0RzVElGNnZsQ2QyVU8xOVB2LVpEdEdFdk51anZMX3hxWUNrUUtTcUl3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnB0eWN4TWZQa1EwWkxIbjRVcXZ4ME5qNEk2cTdwWGI1NzVtaFZDLUg4TUkiLCJpc3MiOiJodHRwczovL2Rldi05MzEyNzA3OC5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE3NDcyMzgzMTksImV4cCI6MTc0NzI0MTkxOSwiY2lkIjoiMG9hb3BsMm02cHB6eGtKWDI1ZDciLCJ1aWQiOiIwMHVvcGxjYm42eW5tcXR0WTVkNyIsInNjcCI6WyJncm91cHMiLCJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiYXV0aF90aW1lIjoxNzQ3MjM4MzE3LCJzdWIiOiJwZWRyb0BleGFtcGxlLmNvbSIsImdyb3VwcyI6WyJFdmVyeW9uZSIsInRpZXIxIl19.QQRQbOiBqxALZQUQNjIdbhFiwnj4ZvYhrqGCxZYsJLL9RKfmjEQ5nKEPnnwgMchJpLvowGUoCkN6rWamHckr3CZjAvdPrcMxNFQmp0Kd7q9mQXjl7SGW4kbrUKlP2xdkLATYZI-ZNklOFnDilR_g14mP4btg8Kgf3vDxl3PFS5HqnisChXg1C-jaTx7M_Eq9USkKPL16zCjnZLDmSdh7DImgbd9VO87TBXkJ0uG669pJa4C0TLBFsqfltk3foG21uYuiR9UAuw4dP5vb_yBSjeE7pLZ_UJkbLlE-y0tOyGYLcW0JKhtepSJuxPfRwPEkXu17nxJDinUpPAH5izEdrA
backend-1   | /usr/local/lib/python3.11/site-packages/urllib3/connectionpool.py:1064: InsecureRequestWarning: Unverified HTTPS request is being made to host 'dev-93127078.okta.com'. Adding certificate verification is strongly advised. See: https://urllib3.readthedocs.io/en/1.26.x/advanced-usage.html#ssl-warnings
backend-1   |   warnings.warn(
backend-1   | /usr/local/lib/python3.11/site-packages/urllib3/connectionpool.py:1064: InsecureRequestWarning: Unverified HTTPS request is being made to host 'dev-93127078.okta.com'. Adding certificate verification is strongly advised. See: https://urllib3.readthedocs.io/en/1.26.x/advanced-usage.html#ssl-warnings
backend-1   |   warnings.warn(
backend-1   | INFO:root:Fetched JWKS: {'keys': [{'kty': 'RSA', 'alg': 'RS256', 'kid': 'UwDsTIF6vlCd2UO19Pv-ZDtGEvNujvL_xqYCkQKSqIw', 'use': 'sig', 'e': 'AQAB', 'n': '0LbtzG7TkhKROUniTLH_S9yBL3Tx1ugdkpS_hI5MmXWj5Cf7il4YkNCCXExZ1UqrXBNQNkCuHN1tsNADYyQvmovqLEdZ2-KPt346-sXkdXZoNsEXyWJsCOgv7z1Ym04sIJXohwN8KpdjhvpI9l7BU90qAeolrUYQGO5QgaKTcgmyOXQQ46yulc0OvwfUfeFXcFN306HBG_saLSzlOELKfYoFSimBo58WfP_RpdNfnN6zi9tIBn7V0x4Q1CSEZF-MSOg-mbE15KQzVnJbBkfrUk-mJZVHIXnQYUOJuSvPSLCjYx20-uU1w4QsgMS9PBUzJXUe8-krXpv1NvFNjqzbgw'}]}
backend-1   | INFO:root:Fetched JWKS: {'keys': [{'kty': 'RSA', 'alg': 'RS256', 'kid': 'UwDsTIF6vlCd2UO19Pv-ZDtGEvNujvL_xqYCkQKSqIw', 'use': 'sig', 'e': 'AQAB', 'n': '0LbtzG7TkhKROUniTLH_S9yBL3Tx1ugdkpS_hI5MmXWj5Cf7il4YkNCCXExZ1UqrXBNQNkCuHN1tsNADYyQvmovqLEdZ2-KPt346-sXkdXZoNsEXyWJsCOgv7z1Ym04sIJXohwN8KpdjhvpI9l7BU90qAeolrUYQGO5QgaKTcgmyOXQQ46yulc0OvwfUfeFXcFN306HBG_saLSzlOELKfYoFSimBo58WfP_RpdNfnN6zi9tIBn7V0x4Q1CSEZF-MSOg-mbE15KQzVnJbBkfrUk-mJZVHIXnQYUOJuSvPSLCjYx20-uU1w4QsgMS9PBUzJXUe8-krXpv1NvFNjqzbgw'}]}
backend-1   | INFO:root:JWT verified: {'ver': 1, 'jti': 'AT.ptycxMfPkQ0ZLHn4Uqvx0Nj4I6q7pXb575mhVC-H8MI', 'iss': 'https://dev-93127078.okta.com/oauth2/default', 'aud': 'api://default', 'iat': 1747238319, 'exp': 1747241919, 'cid': '0oaopl2m6ppzxkJX25d7', 'uid': '00uoplcbn6ynmqttY5d7', 'scp': ['groups', 'openid', 'email', 'profile'], 'auth_time': 1747238317, 'sub': 'pedro@example.com', 'groups': ['Everyone', 'tier1']}
backend-1   | INFO:root:JWT verified: {'ver': 1, 'jti': 'AT.ptycxMfPkQ0ZLHn4Uqvx0Nj4I6q7pXb575mhVC-H8MI', 'iss': 'https://dev-93127078.okta.com/oauth2/default', 'aud': 'api://default', 'iat': 1747238319, 'exp': 1747241919, 'cid': '0oaopl2m6ppzxkJX25d7', 'uid': '00uoplcbn6ynmqttY5d7', 'scp': ['groups', 'openid', 'email', 'profile'], 'auth_time': 1747238317, 'sub': 'pedro@example.com', 'groups': ['Everyone', 'tier1']}
backend-1   | INFO:root:Attempting Vault JWT auth for pedro@example.com
backend-1   | INFO:root:Attempting Vault JWT auth for pedro@example.com
backend-1   | ERROR:root:Error fetching secrets: could not load configuration, on post http://vault:8200/v1/auth/jwt/login
backend-1   | INFO:werkzeug:192.168.65.1 - - [14/May/2025 15:58:41] "GET /secrets HTTP/1.1" 500 -
backend-1   | ERROR:root:Error fetching secrets: could not load configuration, on post http://vault:8200/v1/auth/jwt/login
backend-1   | INFO:werkzeug:192.168.65.1 - - [14/May/2025 15:58:41] "GET /secrets HTTP/1.1" 500 -



v View in Docker Desktop   o View Config   w Enable Watch
