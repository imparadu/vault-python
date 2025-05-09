require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const vault = require('node-vault')({
  endpoint: 'http://vault:8200',
  token: 'myroot',
});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_ISSUER,
  clientId: process.env.OKTA_CLIENT_ID,
  assertClaims: {
    aud: process.env.OKTA_AUDIENCE,
  },
});

// Middleware to verify token and attach user info
const authenticate = async (req, res, next) => {
  console.log('Authenticating request with token:', req.headers.authorization);
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);
  if (!match) return res.status(401).json({ error: 'Missing token' });

  const accessToken = match[1];

  try {
    const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, process.env.OKTA_AUDIENCE);
    req.user = {
      sub: jwt.claims.sub,
      groups: jwt.claims.groups || [],
    };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET secrets (allowed for users and admins)
app.get('/secrets', authenticate, async (req, res) => {
  const userId = req.user.sub;

  try {
    const result = await vault.read(`secret/data/users/${userId}`);
    const data = result.data?.data || {};
    res.json(data);
  } catch (err) {
    if (err.response && err.response.statusCode === 404) {
      return res.json({});
    }
    console.error('Vault read error:', err);
    res.status(500).json({ error: 'Failed to read secrets' });
  }
});

// POST secrets (allowed only for admins)
app.post('/secrets', authenticate, async (req, res) => {
  const userGroups = req.user.groups;
  const isAdmin = userGroups.includes('admin'); // Okta group name

  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { path, value } = req.body;

  if (!path || !value) {
    return res.status(400).json({ error: 'Missing path or value' });
  }

  try {
    await vault.write(`secret/data/${path}`, { data: { value } });
    res.json({ success: true });
  } catch (err) {
    console.error('Vault write error:', err);
    res.status(500).json({ error: 'Failed to write secret' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
