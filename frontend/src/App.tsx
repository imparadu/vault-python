import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, SecureRoute } from "@okta/okta-react";
import CustomLoginCallback from "./CustomLoginCallback";
import axios from "axios";

const oktaAuth = new OktaAuth({
  issuer:
    process.env.REACT_APP_OKTA_ISSUER ??
    "https://dev-93127078.okta.com/oauth2/default",
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID ?? "0oaopl2m6ppzxkJX25d7",
  redirectUri:
    process.env.REACT_APP_OKTA_REDIRECT_URI ??
    "http://localhost:3000/login/callback",
  pkce: true,
  scopes: ["openid", "email", "profile", "groups"],
  responseType: ["code"],
  restoreOriginalUri: undefined, // Explicitly disable default callback
});

console.log("Raw Environment Variables:", {
  REACT_APP_OKTA_ISSUER: process.env.REACT_APP_OKTA_ISSUER,
  REACT_APP_OKTA_CLIENT_ID: process.env.REACT_APP_OKTA_CLIENT_ID,
  REACT_APP_OKTA_REDIRECT_URI: process.env.REACT_APP_OKTA_REDIRECT_URI,
});

console.log("Okta Config:", {
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
  pkce: true,
  scopes: ["openid", "email", "profile", "groups"],
  responseType: ["code"],
});

const Home: React.FC = () => <h1>Home Page</h1>;

const Secrets: React.FC = () => {
  const [secrets, setSecrets] = useState<Array<{ path: string; data: any }>>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const accessToken = oktaAuth.getAccessToken();
        if (!accessToken) {
          console.error("No access token available");
          setError("No access token available");
          setLoading(false);
          return;
        }
        console.log("Sending Authorization header:", `Bearer ${accessToken}`);
        console.log("Fetching secrets from http://localhost:3001/secrets");
        const response = await axios.get("http://localhost:3001/secrets", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Secrets response:", response.data);
        setSecrets(response.data.secrets);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching secrets:", error);
        setError(error.response?.data?.error || "Failed to fetch secrets");
      } finally {
        setLoading(false);
      }
    };

    fetchSecrets();
  }, []);

  return (
    <div>
      <h1>Secrets Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : secrets.length > 0 ? (
        <ul>
          {secrets.map((secret, index) => (
            <li key={index}>
              <strong>Path:</strong> {secret.path}
              <br />
              <strong>Data:</strong> {JSON.stringify(secret.data)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No secrets accessible</p>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const history = useHistory();

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string,
  ) => {
    console.log("Original URI received:", originalUri);
    const targetUri = "/secrets"; // Force redirect to /secrets
    console.log("Restoring to", targetUri, "after login");
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
