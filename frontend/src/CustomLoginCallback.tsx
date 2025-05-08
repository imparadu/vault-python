import React from "react";
import { LoginCallback } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

const CustomLoginCallback = () => {
  const navigate = useNavigate();

  const handleError = (error: Error) => {
    console.error("Token exchange error:", error);
    return (
      <div>
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate("/login")}>Try Again</button>
      </div>
    );
  };

  return (
    <LoginCallback
      errorComponent={({ error }) => handleError(error)}
      onAuthResume={() => navigate("/login")}
    />
  );
};

export default CustomLoginCallback;
