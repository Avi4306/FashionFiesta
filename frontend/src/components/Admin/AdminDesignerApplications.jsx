import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Link as MuiLink, // Alias Link to avoid conflict with react-router-dom Link
  Snackbar, // 🆕 Import Snackbar
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import {
  getDesignerApplications,
  approveDesignerApplication,
  rejectDesignerApplication,
} from '../../actions/admin';
import { CLEAR_ADMIN_ERROR } from '../../constants/actionTypes';

export default function AdminDesignerApplications() {
  const dispatch = useDispatch();
  const { applications, isLoading, error } = useSelector((state) => state.admin);

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openApproveConfirmDialog, setOpenApproveConfirmDialog] = useState(false); // 🆕 State for approve confirmation
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 🆕 State for Snackbar notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    dispatch(getDesignerApplications());
    dispatch({ type: CLEAR_ADMIN_ERROR });
  }, [dispatch]);

  // 🆕 Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 🆕 Handle Approve Confirmation Dialog
  const handleApproveClick = (id) => {
    setCurrentApplicationId(id);
    setOpenApproveConfirmDialog(true);
  };

  const handleApproveConfirm = async () => {
    if (currentApplicationId) {
      setOpenApproveConfirmDialog(false);
      const result = await dispatch(approveDesignerApplication(currentApplicationId));
      if (result.success) {
        setSnackbarMessage('Designer application approved successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(result.message || 'Failed to approve designer application.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      setCurrentApplicationId(null);
    }
  };

  const handleApproveClose = () => {
    setOpenApproveConfirmDialog(false);
    setCurrentApplicationId(null);
  };

  const handleRejectClick = (id) => {
    setCurrentApplicationId(id);
    setOpenRejectDialog(true);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (currentApplicationId && rejectionReason.trim()) {
      setOpenRejectDialog(false);
      const result = await dispatch(rejectDesignerApplication(currentApplicationId, rejectionReason));
      if (result.success) {
        setSnackbarMessage('Designer application rejected successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(result.message || 'Failed to reject designer application.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      setCurrentApplicationId(null);
      setRejectionReason('');
    } else {
      setSnackbarMessage('Please provide a rejection reason.'); // 🆕 Use Snackbar instead of alert
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  const handleRejectClose = () => {
    setOpenRejectDialog(false);
    setCurrentApplicationId(null);
    setRejectionReason('');
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#44403c', display: 'flex', alignItems: 'center' }}>
        <AssignmentTurnedInIcon sx={{ mr: 1, fontSize: 'inherit' }} />
        Designer Applications Management
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: '#aa5a44' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : applications.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>No pending designer applications found.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="designer applications table">
            <TableHead sx={{ bgcolor: '#f0e4d3' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Applicant Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Portfolio</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Experience</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Specializations</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Applied At</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#44403c' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#faf7f3' } }}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.designerApplication?.message || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {app.designerApplication?.portfolioLink ? (
                      <MuiLink href={app.designerApplication.portfolioLink} target="_blank" rel="noopener" sx={{ color: '#aa5a44' }}>
                        View Portfolio
                      </MuiLink>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{app.designerApplication?.yearsExperience || 0} years</TableCell>
                  <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.designerApplication?.specializations || 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(app.designerApplication?.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleOutlineIcon />}
                        sx={{ bgcolor: '#5cb85c', '&:hover': { bgcolor: '#4cae4c' } }}
                        onClick={() => handleApproveClick(app._id)} // 🆕 Use new click handler
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CancelOutlinedIcon />}
                        sx={{ borderColor: '#dc2626', color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}
                        onClick={() => handleRejectClick(app._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reject Application Dialog */}
      <Dialog open={openRejectDialog} onClose={handleRejectClose}>
        <DialogTitle sx={{ color: '#44403c' }}>Reject Designer Application</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting this application. This reason may be shared with the applicant.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejectionReason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccb5a2' },
                '&:hover fieldset': { borderColor: '#aa5a44' },
                '&.Mui-focused fieldset': { borderColor: '#aa5a44' },
              },
              '& .MuiInputLabel-root': { color: '#78716c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#aa5a44' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectClose} sx={{ color: '#aa5a44' }}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            sx={{ bgcolor: '#aa5a44', '&:hover': { bgcolor: '#8e4738' } }}
            disabled={!rejectionReason.trim()}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🆕 Approve Confirmation Dialog */}
      <Dialog open={openApproveConfirmDialog} onClose={handleApproveClose}>
        <DialogTitle sx={{ color: '#44403c' }}>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this designer application? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveClose} sx={{ color: '#aa5a44' }}>Cancel</Button>
          <Button
            onClick={handleApproveConfirm}
            variant="contained"
            sx={{ bgcolor: '#5cb85c', '&:hover': { bgcolor: '#4cae4c' } }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🆕 Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}