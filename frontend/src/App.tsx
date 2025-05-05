import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [secrets, setSecrets] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const login = () => {
    window.location.href = 'http://192.168.0.15:4000/auth/login';
  };

  const fetchSecrets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await fetch('http://192.168.0.15:4000/secrets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSecrets(data);
    } catch (error) {
      console.error('Error fetching secrets:', error);
    }
  };

  return (
    <div className="App">
      <h1>Vault Demo</h1>
      <button onClick={login}>Login</button>
      <button onClick={fetchSecrets}>Fetch Secrets</button>
      {secrets && (
        <pre>{JSON.stringify(secrets, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
