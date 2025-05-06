import React from 'react';
import { LoginCallback } from '@okta/okta-react';

const CustomLoginCallback = () => {
  const handleError = (error: unknown) => {
    console.error('Token exchange error:', error);
    if (error instanceof Error) {
      return <div>Error: {error.message}</div>;
    }
    return <div>An unknown error occurred</div>;
  };

  return <LoginCallback errorComponent={({ error }) => handleError(error)} />;
};

export default CustomLoginCallback;
