const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: 'http://vault:8300',
  token: 'hvs.qOL06AMZceYi8GdP3TOZ50kH', // Replace with new Vault root token
});
const { Pool } = require('pg');
const { Issuer } = require('openid-client');
const { createRemoteJWKSet, jwtVerify } = require('jose');

console.log('openid-client Issuer:', require('openid-client').Issuer);
console.log('Vault token:', '<new-root-token>'); // Debug
console.log('Vault endpoint:', 'http://vault:8300'); // Debug

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://192.168.0.15', credentials: true }));

const secretKey = process.env.JWT_SECRET || 'bXlzZWNyZXRrZXk5234567890abcdef1234567890abcdef';
console.log('JWT_SECRET:', secretKey); // Debug

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/secrets_db',
});

// Initialize Okta OIDC client
let oktaClient;
(async () => {
  try {
    const issuer = await Issuer.discover('https://dev-61996693.okta.com/oauth2/default');
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
    oktaClient = new issuer.Client({
      client_id: '0oaokm64yhFzDSQFK5d7',
      client_secret: 'gWwdLw7CtxnuKRbL5QWgmRjKY6u1RtBf6UqhfTZ1r38ux-WzV4z293QyKFVdTa9I',
      redirect_uris: ['http://192.168.0.15:4000/oidc/callback'],
      response_types: ['code'],
    });
  } catch (err) {
    console.error('Failed to discover Okta issuer:', err);
  }
})();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err); // Debug
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// OIDC login initiation
app.get('/auth/login', async (req, res) => {
  if (!oktaClient) {
    return res.status(500).json({ error: 'Okta client not initialized' });
  }
  const authUrl = oktaClient.authorizationUrl({
    scope: 'openid profile groups',
    response_type: 'code',
  });
  res.redirect(authUrl);
});

// OIDC callback
app.get('/oidc/callback', async (req, res) => {
  try {
    if (!oktaClient) {
      throw new Error('Okta client not initialized');
    }
    const params = oktaClient.callbackParams(req);
    const tokenSet = await oktaClient.callback('http://192.168.0.15:4000/oidc/callback', params);
    const idToken = tokenSet.id_token;

    const JWKS = createRemoteJWKSet(new URL('https://dev-61996693.okta.com/oauth2/default/v1/keys'));
    const { payload } = await jwtVerify(idToken, JWKS);
    const username = payload.email || payload.sub;
    const groups = payload.groups || [];

    const rights = [];
    if (groups.includes('vault-admins')) {
      rights.push('read_db-cred', 'write_db-cred', 'read_api-key');
    }
    if (groups.includes('vault-users')) {
      rights.push('read_db-cred');
    }

    const token = jwt.sign({ username, rights }, secretKey, { expiresIn: '1h' });
    res.redirect(`http://192.168.0.15?token=${token}`);
  } catch (error) {
    console.error('OIDC error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Secrets endpoint
app.get('/secrets', authenticateToken, async (req, res) => {
  try {
    const secrets = {};
    for (const right of req.user.rights) {
      if (right.startsWith('read_')) {
        const secretPath = right.replace('read_', '');
        console.log(`Reading Vault path: secret/data/${secretPath}`); // Debug
        const { data } = await vault.read(`secret/data/${secretPath}`);
        secrets[secretPath] = data.data.value;
      }
    }
    res.json(secrets);
  } catch (error) {
    console.error('Vault error:', error); // Debug
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

// Add secret endpoint
app.post('/secrets', authenticateToken, async (req, res) => {
  try {
    const { path, value } = req.body;
    if (!req.user.rights.includes(`write_${path}`)) {
      return res.status(403).json({ error: 'Unauthorized to write this secret' });
    }
    console.log(`Writing Vault path: secret/data/${path}`); // Debug
    await vault.write(`secret/data/${path}`, { data: { value } });
    res.json({ message: 'Secret added successfully' });
  } catch (error) {
    console.error('Vault error:', error); // Debug
    res.status(500).json({ error: 'Failed to add secret' });
  }
});

app.listen(4000, () => console.log('Backend running on port 4000'));
