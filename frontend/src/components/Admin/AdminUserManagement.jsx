// client/src/components/Admin/AdminUserManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, createAdminUser, updateAdminUserRole, updateAdminUserPassword, deleteAdminUser } from '../../actions/admin';
import { Typography, Select, MenuItem, Button, CircularProgress, Box, Snackbar, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function AdminUserManagement() {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.admin);
  const authData = useSelector((state) => state.auth.authData);
  const currentUserId = authData?.result?._id;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'customer' });

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await dispatch(updateAdminUserRole(userId, newRole));
        setSnackbarMessage(`User role updated to ${newRole}.`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage(error || 'Failed to update role.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      setSnackbarMessage("You cannot delete your own account from here.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await dispatch(deleteAdminUser(userId));
        setSnackbarMessage("User deleted successfully.");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage(error || 'Failed to delete user.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCreateUser = async () => {
    try {
      await dispatch(createAdminUser(newUserData));
      setSnackbarMessage("User created successfully.");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenCreateDialog(false);
      setNewUserData({ name: '', email: '', password: '', role: 'customer' }); // Reset form
    } catch (err) {
      setSnackbarMessage(error || 'Failed to create user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenPasswordDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenPasswordDialog(true);
    setNewPassword(''); // Clear previous password
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setSnackbarMessage("Password cannot be empty.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    try {
      await dispatch(updateAdminUserPassword(selectedUserId, newPassword));
      setSnackbarMessage("User password updated successfully.");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenPasswordDialog(false);
    } catch (err) {
      setSnackbarMessage(error || 'Failed to update password.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
          displayEmpty
          size="small"
          sx={{ '& .MuiSelect-select': { py: '6px' } }}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="pending_designer">Pending Designer</MenuItem>
          <MenuItem value="designer">Designer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenPasswordDialog(params.row._id)}
          >
            Set Password
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteUser(params.row._id)}
            disabled={params.row._id === currentUserId} // Disable delete for current user
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (!users) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#44403c' }}>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        sx={{ mb: 2, backgroundColor: '#aa5a44', '&:hover': { backgroundColor: '#8a483a' } }}
        onClick={() => setOpenCreateDialog(true)}
      >
        Create New User
      </Button>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Select
            label="Role"
            value={newUserData.role}
            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            fullWidth
            variant="outlined"
            displayEmpty
            sx={{ mt: 1 }}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="pending_designer">Pending Designer</MenuItem>
            <MenuItem value="designer">Designer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" sx={{ backgroundColor: '#aa5a44', '&:hover': { backgroundColor: '#8a483a' } }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Update Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Set New Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePassword} variant="contained" sx={{ backgroundColor: '#aa5a44', '&:hover': { backgroundColor: '#8a483a' } }}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}