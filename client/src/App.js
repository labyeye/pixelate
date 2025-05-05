// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import './App.css';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <ProtectedRoute>
                {authService.isAdmin() ? (
                  <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <StaffDashboard setIsAuthenticated={setIsAuthenticated} />
                )}
              </ProtectedRoute>
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;