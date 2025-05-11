from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import hvac
import jwt
import requests
from urllib.parse import quote
import time
import logging
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

app = Flask(__name__)
CORS(app, resources={r"/secrets": {"origins": "https://localhost:3000"}})
logging.basicConfig(level=logging.INFO)

# Vault configuration
VAULT_URL = 'http://vault:8200'
VAULT_TOKEN = 'root'

def init_vault_client(max_retries=5, retry_delay=5):
    for attempt in range(max_retries):
        try:
            client = hvac.Client(url=VAULT_URL, token=VAULT_TOKEN)
            client.is_authenticated()
            logging.info("Vault client authenticated successfully")
            return client
        except Exception as e:
            logging.error(f"Vault connection attempt {attempt + 1}/{max_retries} failed: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                raise Exception(f"Failed to connect to Vault after {max_retries} attempts: {str(e)}")

vault_client = init_vault_client()

# Okta configuration
OKTA_ISSUER = 'https://dev-61996693.okta.com/oauth2/default'
OKTA_AUDIENCE = 'api://default'
OKTA_JWKS_URL = f'{OKTA_ISSUER}/v1/keys'

# Cache JWKS
jwks = None

def verify_jwt(token):
    global jwks
    try:
        if jwks is None:
            response = requests.get(OKTA_JWKS_URL)
            if response.status_code != 200:
                logging.error(f'Failed to fetch JWKS: {response.status_code} {response.reason} for url: {OKTA_JWKS_URL}')
                return None
            response.raise_for_status()
            jwks = response.json()

        headers = jwt.get_unverified_header(token)
        kid = headers.get('kid')
        if not kid:
            logging.error('JWT verification failed: Missing kid in header')
            return None

        key = next((key for key in jwks['keys'] if key['kid'] == kid), None)
        if not key:
            logging.error(f'JWT verification failed: No matching key for kid {kid}')
            return None

        # Convert JWK to PEM-formatted public key
        n = int.from_bytes(jwt.utils.base64url_decode(key['n']), 'big')
        e = int.from_bytes(jwt.utils.base64url_decode(key['e']), 'big')
        public_key = rsa.RSAPublicNumbers(e, n).public_key(default_backend())
        pem_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Decode JWT with PEM-formatted key
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

        return f(decoded, *args, **kwargs)
    return decorated

@app.route('/secrets', methods=['GET'])
@authenticate
def get_secret(decoded):
    try:
        user_email = decoded.get('sub')
        if not user_email:
            logging.error('No sub claim in JWT')
            return jsonify({'error': 'Invalid token payload'}), 401

        secret_path = f'secret/data/users/{user_email}'
        logging.info(f'Attempting to read Vault secret at: {secret_path}')
        secret = vault_client.secrets.kv.v2.read_secret_version(path=f'users/{user_email}', mount_point='secret')
        logging.info(f'Vault read result: {secret}')
        return jsonify(secret['data']['data'])
    except Exception as e:
        logging.error(f'Error reading secret: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
