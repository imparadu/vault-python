import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const AddSecret: React.FC = () => {
  const { oktaAuth } = useOktaAuth();
  const [path, setPath] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = await oktaAuth.getAccessToken();

    const res = await fetch('http://localhost:3001/secrets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ path, value }),
    });

    if (res.ok) {
      setMessage('Secret added!');
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }
  };

  return (
    <div>
      <h2>Add a Secret</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Secret path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <input
          type="text"
          placeholder="Secret value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Add Secret</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddSecret;
