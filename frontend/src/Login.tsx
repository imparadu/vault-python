import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/secrets');
    }
  }, [searchParams, navigate]);

  const login = () => {
    window.location.href = 'http://192.168.0.15:4000/auth/login';
  };

  return (
    <div>
      <h2>Login with Okta</h2>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
