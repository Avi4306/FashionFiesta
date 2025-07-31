import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid } from '@mui/material';
// Material-UI Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // For User Management
import Inventory2Icon from '@mui/icons-material/Inventory2'; // For Product Management
import ArticleIcon from '@mui/icons-material/Article'; // For Post Management
import DashboardIcon from '@mui/icons-material/Dashboard'; // Optional: for the dashboard title itself
// 🆕 New Icon for Designer Applications
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // For reviewing applications

export default function AdminDashboard() {
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#44403c', display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ mr: 1, fontSize: 'inherit' }} />
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleAltIcon sx={{ fontSize: 30, color: '#aa5a44', mr: 1.5 }} />
                <Typography variant="h6" component="h2" sx={{ color: '#aa5a44' }}>
                  User Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View, create, edit roles/passwords, and delete users.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Product Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Inventory2Icon sx={{ fontSize: 30, color: '#aa5a44', mr: 1.5 }} />
                <Typography variant="h6" component="h2" sx={{ color: '#aa5a44' }}>
                  Product Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Manage all products in the system.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Post Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/posts" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ArticleIcon sx={{ fontSize: 30, color: '#aa5a44', mr: 1.5 }} />
                <Typography variant="h6" component="h2" sx={{ color: '#aa5a44' }}>
                  Post Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Oversee style diaries posts.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* 🆕 Designer Applications Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/designer-applications" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentTurnedInIcon sx={{ fontSize: 30, color: '#aa5a44', mr: 1.5 }} />
                <Typography variant="h6" component="h2" sx={{ color: '#aa5a44' }}>
                  Designer Applications
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Review and manage applications from aspiring designers.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Add more admin sections/cards as needed */}
      </Grid>
    </Box>
  );
}