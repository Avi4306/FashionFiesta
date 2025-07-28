import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#44403c' }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="h2" sx={{ color: '#aa5a44', mb: 1 }}>
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, create, edit roles/passwords, and delete users.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="h2" sx={{ color: '#aa5a44', mb: 1 }}>
                Product Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage all products in the system.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Link to="/admin/posts" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="h2" sx={{ color: '#aa5a44', mb: 1 }}>
                Post Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Oversee style diaries posts.
              </Typography>
            </Link>
          </Paper>
        </Grid>

        {/* Add more admin sections/cards as needed */}
      </Grid>
    </Box>
  );
}