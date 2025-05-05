import React, { useState } from 'react';
import authService from '../services/authService';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        setIsAuthenticated(true);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} style={{ padding: '2rem', width: '400px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          PixelateNest Dashboard Login
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
          Demo credentials: admin / password
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;