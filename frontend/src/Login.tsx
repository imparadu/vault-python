import React, { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();

  const login = async () => {
    try {
      console.log("Initiating login with config:", {
        redirectUri: oktaAuth.options.redirectUri,
        pkce: oktaAuth.options.pkce,
        scopes: oktaAuth.options.scopes,
        responseType: oktaAuth.options.responseType,
      });
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error("Okta login error:", error);
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      console.log("User is authenticated, redirecting to /secrets");
      navigate("/secrets", { replace: true });
    }
  }, [authState, navigate]);

  if (!authState) return <div>Loading...</div>;

  // Type assertion to handle isPending as boolean | undefined
  const isPending = authState.isPending as boolean | undefined;

  return (
    <div>
      <h2>Welcome to Hello Vault</h2>
      <button onClick={login} disabled={isPending}>
        Login with Okta
      </button>
    </div>
  );
};

export default Login;
