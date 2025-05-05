import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  Avatar,
  Paper,
  LinearProgress,
  styled,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Today as TodayIcon,
  CheckCircle as CheckCircleIcon,
  ContactMail as ContactMailIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Build as BuildIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import authService from "../services/authService";

const StatusBadge = styled("span")(({ theme, status }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: 12,
  fontSize: "0.75rem",
  fontWeight: 600,
  backgroundColor:
    status === "new"
      ? alpha(theme.palette.info.main, 0.2)
      : status === "contacted"
      ? alpha(theme.palette.warning.main, 0.2)
      : status === "in-progress"
      ? alpha(theme.palette.secondary.main, 0.2)
      : alpha(theme.palette.success.main, 0.2),
  color:
    status === "new"
      ? theme.palette.info.dark
      : status === "contacted"
      ? theme.palette.warning.dark
      : status === "in-progress"
      ? theme.palette.secondary.dark
      : theme.palette.success.dark,
}));

const AdminDashboard = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [growthRate, setGrowthRate] = useState(12.5); // Simulated growth rate

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://pixelate-n5pg.onrender.com/api/contacts", {
        headers: authService.authHeader(),
      });
      setContacts(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (contacts) => {
    const stats = {
      total: contacts.length,
      new: contacts.filter((c) => c.status === "new").length,
      contacted: contacts.filter((c) => c.status === "contacted").length,
      inProgress: contacts.filter((c) => c.status === "in-progress").length,
      completed: contacts.filter((c) => c.status === "completed").length,
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
      console.error("Error updating status:", error);
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
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            {params.row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="500">
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row._id.substring(0, 6)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon color="action" fontSize="small" />
          <Typography variant="body2">{params.row.email}</Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneIcon color="action" fontSize="small" />
          <Typography variant="body2">{params.row.phone}</Typography>
        </Box>
      ),
    },
    {
      field: "purpose",
      headerName: "Purpose",
      width: 200,
      renderCell: (params) => {
        const purposeColors = {
          "web-development": theme.palette.primary.main,
          "video-editing": theme.palette.secondary.main,
          "digital-marketing": theme.palette.error.main,
          branding: theme.palette.warning.main,
          consultation: theme.palette.info.main,
          other: theme.palette.success.main,
        };
        
        const purposeText = {
          "web-development": "Web Dev",
          "video-editing": "Video Edit",
          "digital-marketing": "Marketing",
          branding: "Branding",
          consultation: "Consult",
          other: "Other",
        };
        
        return (
          <Chip
            label={purposeText[params.row.purpose] || "Other"}
            size="small"
            sx={{
              backgroundColor: alpha(purposeColors[params.row.purpose] || theme.palette.grey[500], 0.1),
              color: purposeColors[params.row.purpose] || theme.palette.grey[700],
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row._id, e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "6px 32px 6px 12px",
            },
          }}
          renderValue={(value) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {value === "new" && (
                <HourglassEmptyIcon color="info" fontSize="small" />
              )}
              {value === "contacted" && (
                <ContactMailIcon color="warning" fontSize="small" />
              )}
              {value === "in-progress" && (
                <BuildIcon color="secondary" fontSize="small" />
              )}
              {value === "completed" && (
                <CheckCircleIcon color="success" fontSize="small" />
              )}
              <StatusBadge status={value}>
                {value === "new"
                  ? "New"
                  : value === "contacted"
                  ? "Contacted"
                  : value === "in-progress"
                  ? "In Progress"
                  : "Completed"}
              </StatusBadge>
            </Box>
          )}
        >
          <MenuItem value="new">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HourglassEmptyIcon color="info" fontSize="small" />
              <Typography>New</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="contacted">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ContactMailIcon color="warning" fontSize="small" />
              <Typography>Contacted</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="in-progress">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BuildIcon color="secondary" fontSize="small" />
              <Typography>In Progress</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="completed">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography>Completed</Typography>
            </Box>
          </MenuItem>
        </Select>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TodayIcon color="action" fontSize="small" />
          <Typography variant="body2">
            {new Date(params.row.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, color: "primary.main" }}
          >
            Pixelate Nest
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, pt: 10, px: 4, pb: 4 }}>
        {/* Welcome Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: "common.white",
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  Welcome back, Admin!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  You have {stats.new} new contacts and {stats.inProgress} in
                  progress projects to review today.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <GroupIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Total Contacts
                    </Typography>
                    <Typography variant="h4" fontWeight="700">
                      {stats.total}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <GroupIcon color="primary" />
                  </Avatar>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUpIcon color="success" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    <Typography
                      component="span"
                      color="success.main"
                      fontWeight="500"
                    >
                      +{growthRate}%
                    </Typography>{" "}
                    from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                borderLeft: `4px solid ${theme.palette.info.main}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      New Leads
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      color="info.dark"
                    >
                      {stats.new}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                    }}
                  >
                    <HourglassEmptyIcon color="info" />
                  </Avatar>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  <Typography
                    component="span"
                    color="info.main"
                    fontWeight="500"
                  >
                    {Math.round((stats.new / stats.total) * 100)}%
                  </Typography>{" "}
                  of total contacts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                borderLeft: `4px solid ${theme.palette.warning.main}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Contacted
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      color="warning.dark"
                    >
                      {stats.contacted}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    <ContactMailIcon color="warning" />
                  </Avatar>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  <Typography
                    component="span"
                    color="warning.main"
                    fontWeight="500"
                  >
                    {stats.contacted > 0 ? Math.round((stats.contacted / stats.new) * 100) : 0}%
                  </Typography>{" "}
                  follow-up rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                borderLeft: `4px solid ${theme.palette.success.main}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Completed
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      color="success.dark"
                    >
                      {stats.completed}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <AssignmentTurnedInIcon color="success" />
                  </Avatar>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  <Typography
                    component="span"
                    color="success.main"
                    fontWeight="500"
                  >
                    {Math.round((stats.completed / stats.total) * 100)}%
                  </Typography>{" "}
                  conversion rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Contacts Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Recent Contacts
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, textTransform: "none" }}
                onClick={fetchContacts}
              >
                Refresh
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Paper
              sx={{
                height: "calc(100vh - 380px)",
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {loading && <LinearProgress />}
              <DataGrid
                rows={contacts}
                columns={columns}
                loading={loading}
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                sx={{
                  [`& .${gridClasses.cell}`]: {
                    py: 1.5,
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "background.default",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: "background.paper",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              />
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;