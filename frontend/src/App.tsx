import { OktaAuth } from "@okta/okta-auth-js";
import { Security, useOktaAuth } from "@okta/okta-react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ReactElement } from "react";
import Login from "./Login";
import CustomLoginCallback from "./CustomLoginCallback";

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
  return authState.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  const navigate = useNavigate();

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string,
  ) => {
    console.log("Restoring original URI:", originalUri);
    navigate(originalUri || "/", { replace: true });
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Home</h2>
              <a href="/login">Login</a>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/login/callback" element={<CustomLoginCallback />} />
        <Route
          path="/secrets"
          element={
            <ProtectedRoute>
              <div>Secrets Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Security>
  );
};

export default App;
