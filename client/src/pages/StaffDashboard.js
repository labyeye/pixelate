// StaffDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  DataGrid
} from '@mui/x-data-grid';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import authService from '../services/authService';

const StaffDashboard = ({ setIsAuthenticated }) => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://pixelate-n5pg.onrender.com/api/contacts', {
        headers: authService.authHeader()
      });
      setContacts(response.data);
      calculateStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  const calculateStats = (contacts) => {
    const stats = {
      assigned: contacts.filter(c => c.status === 'contacted' || c.status === 'in-progress').length,
      inProgress: contacts.filter(c => c.status === 'in-progress').length,
      completed: contacts.filter(c => c.status === 'completed').length
    };
    setStats(stats);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://pixelate-n5pg.onrender.com/api/contacts/${id}`,
        { status: newStatus },
        { headers: authService.authHeader() }
      );
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { 
      field: 'purpose', 
      headerName: 'Purpose', 
      width: 180,
      valueFormatter: (params) => {
        const purposes = {
          'web-development': 'Web Development',
          'video-editing': 'Video Editing',
          'digital-marketing': 'Digital Marketing',
          'branding': 'Branding',
          'consultation': 'Consultation',
          'other': 'Other'
        };
        return purposes[params.value] || params.value;
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 180,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row._id, e.target.value)}
          size="small"
          fullWidth
          disabled={params.row.status === 'new'} // Staff can't change from new status
        >
          <MenuItem value="contacted">Contacted</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      )
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Staff Dashboard
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5">Assigned</Typography>
                <Typography variant="h3">{stats.assigned}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5">In Progress</Typography>
                <Typography variant="h3">{stats.inProgress}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5">Completed</Typography>
                <Typography variant="h3">{stats.completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* DataGrid */}
        <Box sx={{ height: 'calc(100vh - 280px)', width: '100%' }}>
          <DataGrid
            rows={contacts.filter(c => c.status !== 'new')} // Staff only sees assigned contacts
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StaffDashboard;