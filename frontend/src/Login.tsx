import React from 'react';
import { useOktaAuth } from '@okta/okta-react';

const Login: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  if (!authState) return <div>Loading...</div>;

  if (authState.isAuthenticated) {
    window.location.replace('/secrets');
    return null;
  }

  return (
    <div>
      <h2>Welcome to Hello Vault</h2>
      <button onClick={login}>Login with Okta</button>
    </div>
  );
};

export default Login;
