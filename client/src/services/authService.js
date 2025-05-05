import axios from "axios";
const API_URL = 'http://localhost:3500/api/auth';

export default {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  authHeader: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { 'x-auth-token': user.token };
    }
    return {};
  },
  
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
  }
};