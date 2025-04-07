const express = require('express');
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: 'http://vault:8200',
  token: 'myroot',
});
const cors = require('cors'); // Add this line

const app = express();
app.use(express.json());
app.use(cors()); // Add this line to enable CORS for all origins

const users = {
  'user1': { password: 'pass1', rights: ['read_secret1'] },
  'user2': { password: 'pass2', rights: ['read_secret2'] },
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const secrets = {};
    for (const right of user.rights) {
      if (right.startsWith('read_')) {
        const secretPath = right.replace('read_', '');
        const { data } = await vault.read(`secret/data/${secretPath}`);
        secrets[secretPath] = data.data.value;
      }
    }
    res.json({ message: 'Login successful', rights: user.rights, secrets });
  } catch (error) {
    console.error('Vault error:', error);
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

app.listen(4000, () => console.log('Backend running on port 4000'));
