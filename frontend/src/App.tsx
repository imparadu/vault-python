import { OktaAuth } from "@okta/okta-auth-js";
import { Security, useOktaAuth } from "@okta/okta-react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import CustomLoginCallback from "./CustomLoginCallback";
import axios from "axios";

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_ISSUER || "http://default-issuer-url",
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
  pkce: true,
  scopes: ["openid", "email", "profile"],
  responseType: ["code"],
});

console.log(
  "Raw Environment Variables:",
  JSON.stringify(
    {
      REACT_APP_OKTA_ISSUER: process.env.REACT_APP_OKTA_ISSUER,
      REACT_APP_OKTA_CLIENT_ID: process.env.REACT_APP_OKTA_CLIENT_ID,
      REACT_APP_OKTA_REDIRECT_URI: process.env.REACT_APP_OKTA_REDIRECT_URI,
    },
    null,
    2,
  ),
);
console.log(
  "Okta Config:",
  JSON.stringify(
    {
      issuer: oktaAuth.options.issuer,
      clientId: oktaAuth.options.clientId,
      redirectUri: oktaAuth.options.redirectUri,
      pkce: oktaAuth.options.pkce,
      scopes: oktaAuth.options.scopes,
      responseType: oktaAuth.options.responseType,
    },
    null,
    2,
  ),
);

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useOktaAuth();
  console.log("ProtectedRoute authState:", JSON.stringify(authState, null, 2));
  if (!authState) return <div>Loading...</div>;
  return authState.isAuthenticated ? children : <Navigate to="/" replace />;
};

const Home = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState) return;
    if (!authState.isAuthenticated) {
      console.log("User is not authenticated, redirecting to Okta");
      oktaAuth.signInWithRedirect();
    } else {
      console.log("User is authenticated, redirecting to /secrets");
      navigate("/secrets", { replace: true });
    }
  }, [authState, oktaAuth, navigate]);

  if (!authState || !authState.isAuthenticated) return <div>Loading...</div>;
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};

const SecretsPage = () => {
  const { authState } = useOktaAuth();
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authState?.accessToken?.accessToken) {
      console.log("No access token, skipping fetch");
      return;
    }

    const fetchSecret = async () => {
      try {
        console.log("Fetching secret from http://localhost:3001/secrets");
        const response = await axios.get("http://localhost:3001/secrets", {
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken || ""}`,
          },
        });
        console.log("Secret response:", JSON.stringify(response.data, null, 2));
        setSecret(response.data.message || "No secret found");
      } catch (err) {
        console.error("Error fetching secret:", err);
        setError("Failed to fetch secret");
      }
    };

    fetchSecret();
  }, [authState]);

  if (error) return <div>Error: {error}</div>;
  if (secret === null) return <div>Loading secret...</div>;

  return (
    <div>
      <h2>Secrets Page</h2>
      <p>Secret: {secret}</p>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    _originalUri: string,
  ) => {
    console.log("Restoring to /secrets after login");
    navigate("/secrets", { replace: true });
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/callback" element={<CustomLoginCallback />} />
        <Route
          path="/secrets"
          element={
            <ProtectedRoute>
              <SecretsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Security>
  );
};

export default App;
