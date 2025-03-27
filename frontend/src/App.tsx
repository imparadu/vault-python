import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<string | null>(null);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('http://192.168.0.15:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setResponse(`Logged in! Rights: ${data.rights.join(', ')}\nSecrets: ${JSON.stringify(data.secrets)}`);
    } else {
      setResponse(`Error: ${data.error}`);
    }
  } catch (error) {
    setResponse('Failed to connect to backend');
  }
};

  return (
    <div className="App">
      <h1>Login to Vault</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default App;
