import React from 'react';
import { useOktaAuth } from '@okta/okta-react';

const Login: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => {
    try {
      console.log('Initiating login with config:', {
        redirectUri: oktaAuth.options.redirectUri,
        pkce: oktaAuth.options.pkce,
        scopes: oktaAuth.options.scopes,
        responseType: oktaAuth.options.responseType,
      });
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error('Okta login error:', error);
    }
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
