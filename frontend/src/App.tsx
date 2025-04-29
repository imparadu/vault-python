import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Secrets from './Secrets';
import AddSecret from './AddSecret';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Secret Management Dashboard</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/secrets"
            element={isAuthenticated ? <Secrets /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-secret"
            element={isAuthenticated ? <AddSecret /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
