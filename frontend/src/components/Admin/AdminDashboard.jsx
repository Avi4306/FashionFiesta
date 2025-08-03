import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid } from '@mui/material';
// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
// 🆕 Icon for Outfit Management
import CheckroomIcon from '@mui/icons-material/Checkroom';

export default function AdminDashboard() {
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#44403c', display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ mr: 1, fontSize: 'inherit' }} />
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/users" style={linkStyle}>
              <CardHeader icon={<PeopleAltIcon />} title="User Management" />
              <Typography variant="body2" color="text.secondary">
                View, create, edit roles/passwords, and delete users.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Product Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/products" style={linkStyle}>
              <CardHeader icon={<Inventory2Icon />} title="Product Management" />
              <Typography variant="body2" color="text.secondary">
                Manage all products in the system.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Post Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/posts" style={linkStyle}>
              <CardHeader icon={<ArticleIcon />} title="Post Management" />
              <Typography variant="body2" color="text.secondary">
                Oversee style diaries posts.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Designer Applications */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/designer-applications" style={linkStyle}>
              <CardHeader icon={<AssignmentTurnedInIcon />} title="Designer Applications" />
              <Typography variant="body2" color="text.secondary">
                Review and manage applications from aspiring designers.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Donation Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/donations" style={linkStyle}>
              <CardHeader icon={<VolunteerActivismIcon />} title="Donation Management" />
              <Typography variant="body2" color="text.secondary">
                View, manage, and update the status of clothing donations.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* 🆕 Outfit Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Link to="/admin/outfit-of-the-week" style={linkStyle}>
              <CardHeader icon={<CheckroomIcon />} title="Outfit Of The Week Management" />
              <Typography variant="body2" color="text.secondary">
                Review, feature, or delete submitted outfits of the week.
              </Typography>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// 🔁 Reusable styles and header
const cardStyle = {
  p: 3,
  borderRadius: '12px',
  transition: 'all 0.3s',
  '&:hover': { boxShadow: 6 },
};

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
};

const CardHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {React.cloneElement(icon, { sx: { fontSize: 30, color: '#aa5a44', mr: 1.5 } })}
    <Typography variant="h6" component="h2" sx={{ color: '#aa5a44' }}>
      {title}
    </Typography>
  </Box>
);