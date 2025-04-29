import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSecret: React.FC = () => {
  const [path, setPath] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.0.15:4000/secrets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, value }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Secret added successfully');
        setTimeout(() => navigate('/secrets'), 1000);
      } else {
        setMessage(data.error || 'Failed to add secret');
      }
    } catch (err) {
      setMessage('Failed to connect to backend');
    }
  };

  return (
    <div>
      <h2>Add New Secret</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Secret Name:</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="e.g., db-cred"
          />
        </div>
        <div>
          <label>Value:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter secret value"
          />
        </div>
        <button type="submit">Add Secret</button>
        <button onClick={() => navigate('/secrets')}>Back</button>
      </form>
      {message && <pre>{message}</pre>}
    </div>
  );
};

export default AddSecret;
