from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import hvac
import jwt
import requests
import logging
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

app = Flask(__name__)
CORS(app, resources={r"/secrets": {"origins": "http://localhost:3000"}})
logging.basicConfig(level=logging.INFO)

# Vault configuration
VAULT_URL = 'http://vault:8200'

def init_vault_client():
    try:
        client = hvac.Client(url=VAULT_URL)
        return client
    except Exception as e:
        logging.error(f"Failed to initialize Vault client: {str(e)}")
        raise

vault_client = init_vault_client()

# Okta configuration
OKTA_ISSUER = 'https://dev-93127078.okta.com/oauth2/default'
OKTA_AUDIENCE = 'api://default'
OKTA_JWKS_URL = f'{OKTA_ISSUER}/v1/keys'

def verify_jwt(token):
    try:
        response = requests.get(OKTA_JWKS_URL)
        if response.status_code != 200:
            logging.error(f'Failed to fetch JWKS: {response.status_code} {response.reason} for url: {OKTA_JWKS_URL}')
            return None
        response.raise_for_status()
        jwks = response.json()
        logging.info(f'Fetched JWKS: {jwks}')

        headers = jwt.get_unverified_header(token)
        kid = headers.get('kid')
        if not kid:
            logging.error('JWT verification failed: Missing kid in header')
            return None

        key = next((key for key in jwks['keys'] if key['kid'] == kid), None)
        if not key:
            logging.error(f'JWT verification failed: No matching key for kid {kid}')
            return None

        n = int.from_bytes(jwt.utils.base64url_decode(key['n']), 'big')
        e = int.from_bytes(jwt.utils.base64url_decode(key['e']), 'big')
        public_key = rsa.RSAPublicNumbers(e, n).public_key(default_backend())
        pem_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        decoded = jwt.decode(
            token,
            pem_key,
            algorithms=['RS256'],
            issuer=OKTA_ISSUER,
            audience=OKTA_AUDIENCE
        )
        logging.info(f'JWT verified: {decoded}')
        return decoded
    except Exception as e:
        logging.error(f'JWT verification failed: {str(e)}')
        return None

def authenticate(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        logging.info(f'Received Authorization header: {auth_header}')
        if not auth_header.startswith('Bearer '):
            logging.error('Missing or malformed Authorization header')
            return jsonify({'error': 'Missing token'}), 401

        token = auth_header.split(' ')[1]
        decoded = verify_jwt(token)
        if decoded is None:
            logging.error('Token verification failed')
            return jsonify({'error': 'Invalid token'}), 401

        return f(decoded, token, *args, **kwargs)
    return decorated

@app.route('/secrets', methods=['GET'])
@authenticate
def get_secrets(decoded, token):
    try:
        user_email = decoded.get('sub')
        if not user_email:
            logging.error('No sub claim in JWT')
            return jsonify({'error': 'Invalid token payload'}), 401

        # Authenticate with Vault using JWT auth method
        logging.info(f'Attempting Vault JWT auth for {user_email}')
        response = vault_client.auth.jwt.jwt_login(
            role="okta-user",
            jwt=token
        )
        vault_token = response['auth']['client_token']
        vault_client.token = vault_token
        logging.info(f'Vault JWT auth successful for {user_email}')

        # List accessible secrets under restricted folder
        secrets_list = []
        subfolders = ['api-keys', 'db-creds', 'config']
        for subfolder in subfolders:
            try:
                list_response = vault_client.secrets.kv.v2.list_secrets(
                    path=f'restricted/{subfolder}',
                    mount_point='secret'
                )
                keys = list_response['data']['keys']
                for key in keys:
                    try:
                        secret = vault_client.secrets.kv.v2.read_secret_version(
                            path=f'restricted/{subfolder}/{key}',
                            mount_point='secret'
                        )
                        secrets_list.append({
                            'path': f'restricted/{subfolder}/{key}',
                            'data': secret['data']['data']
                        })
                    except Exception as e:
                        logging.info(f'No access to secret restricted/{subfolder}/{key}: {str(e)}')
            except Exception as e:
                logging.info(f'No access to subfolder restricted/{subfolder}: {str(e)}')

        return jsonify({'secrets': secrets_list})
    except Exception as e:
        logging.error(f'Error fetching secrets: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
