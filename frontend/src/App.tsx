import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';

import Login from './Login';
import Secrets from './Secrets';
import AddSecret from './AddSecret';

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_ISSUER || 'http://default-issuer-url',
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
  pkce: true, // <-- Optional, but best practice for SPA security
});

console.log('Okta Config:', {
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
  pkce: oktaAuth.options.pkce,
});

function App() {
  return (
    <Router>
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={async (_oktaAuth, originalUri) => {
          window.location.replace(toRelativeUrl(originalUri || '/', window.location.origin));
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="/secrets" element={<SecureRoute element={<Secrets />} />} />
          <Route path="/add-secret" element={<SecureRoute element={<AddSecret />} />} />
        </Routes>
      </Security>
    </Router>
  );
}

export default App;
