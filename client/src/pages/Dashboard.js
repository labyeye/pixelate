import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Select,
  MenuItem,
  Typography,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import authService from "../services/authService";

const Dashboard = ({ setIsAuthenticated }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('Contacts data before render:', contacts);
  }, [contacts]);
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      console.log("Fetching contacts...");
      const response = await axios.get("http://localhost:3500/api/contacts", {
        headers: authService.authHeader(),
      });
      console.log("Full API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3500/api/contacts/${id}`,
        { status: newStatus },
        { headers: authService.authHeader() }
      );
      fetchContacts();
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };
  // In Dashboard.js, modify the columns definition and add data validation
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      value: (params) => params.row.name || 'N/A'
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250,
      value: (params) => params.row.email || 'N/A'
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      value: (params) => params.row.phone || "N/A",
    },
    {
      field: "purpose",
      headerName: "Purpose",
      width: 180,
      value: (params) => {
        const purposes = {
          "web-development": "Web Development",
          "video-editing": "Video Editing",
          "digital-marketing": "Digital Marketing",
          branding: "Branding",
          consultation: "Consultation",
          other: "Other",
        };
        return (
          purposes[params.row.purpose] ||
          params.row?.purpose ||
          "Not specified"
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      value: (params) => params.row.status || "new",
      renderCell: (params) => (
        <Select
          value={params.row?.status || "new"}
          onChange={(e) => handleStatusChange(params.row?._id, e.target.value)}
          size="small"
        >
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="contacted">Contacted</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      value: (params) =>
        params.row.date ? new Date(params.row.date).toLocaleString() : "N/A",
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PixelateNest Contacts Dashboard
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <div style={{ height: "calc(100vh - 120px)", width: "100%" }}>
          <DataGrid
            rows={contacts}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            loading={loading}
            getRowId={(row) => row._id || Math.random()}
            // Add this to verify rows:
            onStateChange={(state) => console.log("DataGrid state:", state)}
          />
        </div>
      </Box>
    </div>
  );
};

export default Dashboard;
