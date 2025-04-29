import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Secrets: React.FC = () => {
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://192.168.0.15:4000/secrets', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSecrets(data);
        } else {
          setError(data.error || 'Failed to fetch secrets');
        }
      } catch (err) {
        setError('Failed to connect to backend');
      }
    };
    fetchSecrets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Your Secrets</h2>
      <button onClick={() => navigate('/add-secret')}>Add Secret</button>
      <button onClick={handleLogout}>Logout</button>
      {error ? (
        <pre>{error}</pre>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Secret Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(secrets).map(([name, value]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Secrets;
