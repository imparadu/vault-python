import React, { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const Secrets: React.FC = () => {
  const { oktaAuth } = useOktaAuth();
  const [secrets, setSecrets] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchSecrets = async () => {
      const accessToken = await oktaAuth.getAccessToken();
      const res = await fetch('http://localhost:3001/secrets', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setSecrets(data);
    };
    fetchSecrets();
  }, [oktaAuth]);

  return (
    <div>
      <h2>Your Secrets</h2>
      <pre>{JSON.stringify(secrets, null, 2)}</pre>
    </div>
  );
};

export default Secrets;
