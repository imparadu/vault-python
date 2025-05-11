import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute } from '@okta/okta-react';
import CustomLoginCallback from './CustomLoginCallback';
import axios from 'axios';

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_ISSUER ?? 'https://dev-61996693.okta.com/oauth2/default',
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID ?? '0oaolzq3t8tsEPurx5d7',
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI ?? 'https://localhost:3000/login/callback',
  pkce: true,
  scopes: ['openid', 'email', 'profile'],
  responseType: ['code'],
  restoreOriginalUri: undefined // Explicitly disable default callback
});

console.log('Raw Environment Variables:', {
  REACT_APP_OKTA_ISSUER: process.env.REACT_APP_OKTA_ISSUER,
  REACT_APP_OKTA_CLIENT_ID: process.env.REACT_APP_OKTA_CLIENT_ID,
  REACT_APP_OKTA_REDIRECT_URI: process.env.REACT_APP_OKTA_REDIRECT_URI
});

console.log('Okta Config:', {
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
  pkce: true,
  scopes: ['openid', 'email', 'profile'],
  responseType: ['code']
});

const Home: React.FC = () => <h1>Home Page</h1>;

const Secrets: React.FC = () => {
  const [secret, setSecret] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const accessToken = oktaAuth.getAccessToken();
        if (!accessToken) {
          console.error('No access token available');
          setError('No access token available');
          return;
        }
        console.log('Sending Authorization header:', `Bearer ${accessToken}`);
        console.log('Fetching secret from http://localhost:3001/secrets');
        const response = await axios.get('http://localhost:3001/secrets', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('Secret response:', response.data);
        setSecret(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching secret:', error);
        setError(error.response?.data?.error || 'Failed to fetch secret');
      }
    };

    fetchSecret();
  }, []);

  return (
    <div>
      <h1>Secrets Page</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Secret: {secret ? secret.message : 'No secret found'}</p>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    console.log('Original URI received:', originalUri);
    const targetUri = '/secrets'; // Force redirect to /secrets
    console.log('Restoring to', targetUri, 'after login');
    history.replace(toRelativeUrl(targetUri, window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Switch>
        <SecureRoute path="/" exact component={Home} />
        <Route path="/login/callback" component={CustomLoginCallback} />
        <SecureRoute path="/secrets" component={Secrets} />
      </Switch>
    </Security>
  );
};

export default App;
