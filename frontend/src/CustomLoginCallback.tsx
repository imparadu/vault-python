import React, { useEffect } from "react";
import { LoginCallback } from "@okta/okta-react";

const CustomLoginCallback: React.FC = () => {
  useEffect(() => {
    console.log("Okta callback processed", {
      url: window.location.href,
      search: window.location.search,
    });
  }, []);

  const errorComponent = ({ error }: { error?: Error }) => {
    console.error("Okta authentication error:", error?.message, error);
    return <div>Authentication error: {error?.message || "Unknown error"}</div>;
  };

  return <LoginCallback errorComponent={errorComponent} />;
};

export default CustomLoginCallback;
