const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: 'http://vault:8400',
  token: 'myroot', // Update later with root token
});
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://192.168.0.15:3000' }));

const secretKey = 'your-secret-key';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/secrets_db',
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, rights: user.rights }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/secrets', authenticateToken, async (req, res) => {
  try {
    const secrets = {};
    for (const right of req.user.rights) {
      if (right.startsWith('read_')) {
        const secretPath = right.replace('read_', '');
        const { data } = await vault.read(`secret/data/${secretPath}`);
        secrets[secretPath] = data.data.value;
      }
    }
    res.json(secrets);
  } catch (error) {
    console.error('Vault error:', error);
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

app.post('/secrets', authenticateToken, async (req, res) => {
  const { path, value } = req.body;
  if (!req.user.rights.includes(`write_${path}`)) {
    return res.status(403).json({ error: 'Unauthorized to write this secret' });
  }

  try {
    await vault.write(`secret/data/${path}`, { data: { value } });
    res.json({ message: 'Secret added successfully' });
  } catch (error) {
    console.error('Vault error:', error);
    res.status(500).json({ error: 'Failed to add secret' });
  }
});

const initDb = async () => {
  for (let i = 0; i < 5; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          username VARCHAR(50) PRIMARY KEY,
          password VARCHAR(100) NOT NULL,
          rights TEXT[] NOT NULL
        );
      `);
      console.log('Database initialized');
      return;
    } catch (error) {
      console.error('Database init attempt', i + 1, 'failed:', error);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  console.error('Failed to initialize database after retries');
};
initDb();

app.listen(4000, () => console.log('Backend running on port 4000'));
