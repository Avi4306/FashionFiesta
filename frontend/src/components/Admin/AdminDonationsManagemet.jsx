import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminDonations,
  updateAdminDonationStatus,
  clearAdminError,
} from '../../actions/admin';
import {
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  IconButton,
} from '@mui/material';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import { Close as CloseIcon } from '@mui/icons-material';

// A simple utility function to format status text
const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// A simple utility function to format the condition
const formatCondition = (condition) => {
  return condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * DonationTableSkeleton Component
 *
 * This component provides a placeholder "skeleton" for the donations table
 * while data is being loaded. It mimics the table structure and animates with a shimmer effect.
 */
const DonationTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 10 }, (_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Box className="flex flex-col space-y-2">
          <Box className="h-4 w-3/4 bg-gray-300 rounded-md animate-pulse"></Box>
          <Box className="h-3 w-1/2 bg-gray-200 rounded-md animate-pulse"></Box>
          <Box className="h-3 w-1/3 bg-gray-200 rounded-md animate-pulse"></Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box className="h-6 w-16 bg-gray-300 rounded-full animate-pulse mx-auto"></Box>
      </TableCell>
      <TableCell align="center">
        <Box className="flex flex-col space-y-1">
          <Box className="h-3 w-2/3 bg-gray-200 rounded-md animate-pulse"></Box>
          <Box className="h-3 w-3/4 bg-gray-200 rounded-md animate-pulse"></Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box className="h-3 w-4/5 bg-gray-200 rounded-md animate-pulse"></Box>
      </TableCell>
      <TableCell align="center">
        <Box className="h-8 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></Box>
      </TableCell>
    </TableRow>
  ));

  return (
    <TableContainer component={Paper} className="shadow-lg rounded-xl">
      <Table>
        <TableHead className="bg-[#aa5a44]">
          <TableRow>
            <TableCell className="text-white font-bold">Item & Donor</TableCell>
            <TableCell align="center" className="text-white font-bold">Status</TableCell>
            <TableCell align="center" className="text-white font-bold">Details</TableCell>
            <TableCell align="center" className="text-white font-bold">Pickup Address</TableCell>
            <TableCell align="center" className="text-white font-bold">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/**
 * AdminDonations Component
 *
 * This component displays all donation requests in a paginated table. It allows administrators
 * to view details and update the status of each donation.
 */
export default function AdminDonations() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');

  const {
    donations = [],
    isLoading,
    error,
    donationsPagination,
  } = useSelector((state) => state.admin);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  useEffect(() => {
    dispatch(getAdminDonations(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    dispatch(clearAdminError());
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // 🆕 Open the confirmation dialog instead of dispatching directly
  const handleStatusChange = (donationId, newStatus) => {
    // Find the donation to store for the dialog
    const donation = donations.find(d => d._id === donationId);
    if (donation) {
      setSelectedDonation(donation);
      setStatusToUpdate(newStatus);
      setConfirmDialogOpen(true);
    }
  };

  // 🆕 Function to handle the confirmed status update
  const handleConfirmAction = () => {
    setConfirmDialogOpen(false);
    if (selectedDonation && statusToUpdate) {
      dispatch(updateAdminDonationStatus(selectedDonation._id, statusToUpdate));
      setSnackbarMessage('Donation status updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  // 🆕 Functions to handle image modal
  const handleImageModalOpen = (donation) => {
    setSelectedDonation(donation);
    setImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setImageModalOpen(false);
    setSelectedDonation(null);
  };

  if (isLoading) {
    return (
      <Box className="p-8 bg-[#f5f5f5] min-h-screen">
        <h2 className="text-3xl font-bold text-[#44403c] text-center mb-8">
          All Donation Requests
        </h2>
        <DonationTableSkeleton />
        <Box className="flex justify-center mt-6">
          <Pagination
            count={donationsPagination.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            disabled
          />
        </Box>
      </Box>
    );
  }

  if (donations.length === 0 && !isLoading) {
    return (
      <Box className="max-w-4xl mx-auto px-4 py-10 text-center text-[#44403c]">
        <h2 className="text-3xl font-bold mb-4">All Donation Requests</h2>
        <p className="text-lg">There are no new donation requests at this time.</p>
      </Box>
    );
  }

  return (
    <Box className="p-8 bg-[#f5f5f5] min-h-screen">
      <h2 className="text-3xl font-bold text-[#44403c] text-center mb-8">
        All Donation Requests
      </h2>
      
      <TableContainer component={Paper} className="shadow-lg rounded-xl">
        <Table sx={{ minWidth: 650 }} aria-label="donations table">
          <TableHead className="bg-[#aa5a44]">
            <TableRow>
              <TableCell className="text-white font-bold">Item & Donor</TableCell>
              <TableCell align="center" className="text-white font-bold">Status</TableCell>
              <TableCell align="center" className="text-white font-bold">Details</TableCell>
              <TableCell align="center" className="text-white font-bold">Pickup Address</TableCell>
              <TableCell align="center" className="text-white font-bold">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation._id} hover>
                <TableCell component="th" scope="row">
                  <Box className="flex flex-col">
                    <span className="font-semibold text-[#aa5a44]">{donation.itemType}</span>
                    <span className="text-sm text-gray-600">
                      by {donation.user.name}
                    </span>
                    {/* 🆕 Add a mailto link for the donor's email */}
                    <a href={`mailto:${donation.user.email}`} className="text-xs text-blue-500 hover:underline">
                      {donation.user.email}
                    </a>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={formatStatus(donation.status)}
                    color={
                      donation.status === 'pending'
                        ? 'warning'
                        : donation.status === 'collected'
                        ? 'success'
                        : donation.status === 'scheduled'
                        ? 'info'
                        : 'error'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center" className="text-sm">
                  <Box>
                    <p>
                      <span className="font-semibold">Quantity:</span> {donation.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Condition:</span> {formatCondition(donation.condition)}
                    </p>
                    {donation.description && (
                      <p>
                        <span className="font-semibold">Notes:</span> {donation.description}
                      </p>
                    )}
                    {/* 🆕 Add a button to view images in a modal */}
                    {donation.photos && donation.photos.length > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PhotoIcon className="h-4 w-4" />}
                        sx={{ mt: 1 }}
                        onClick={() => handleImageModalOpen(donation)}
                      >
                        View Photos
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center" className="text-sm">
                  {donation.pickupAddress.street}, {donation.pickupAddress.city}, {donation.pickupAddress.state} {donation.pickupAddress.zip}
                </TableCell>
                <TableCell align="center">
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id={`status-label-${donation._id}`}>Status</InputLabel>
                    <Select
                      labelId={`status-label-${donation._id}`}
                      id={`status-select-${donation._id}`}
                      value={donation.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(donation._id, e.target.value)}
                    >
                      <MenuItem value="pending">
                        <ClockIcon className="h-4 w-4 mr-2 text-yellow-500" /> Pending
                      </MenuItem>
                      <MenuItem value="scheduled">
                        <CheckCircleIcon className="h-4 w-4 mr-2 text-blue-500" /> Scheduled
                      </MenuItem>
                      <MenuItem value="collected">
                        <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" /> Collected
                      </MenuItem>
                      <MenuItem value="cancelled">
                        <XCircleIcon className="h-4 w-4 mr-2 text-red-500" /> Cancelled
                      </MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex justify-center mt-6">
        <Pagination
          count={donationsPagination.totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* 🆕 Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {"Confirm Status Change"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to change the status of this donation to **{formatStatus(statusToUpdate)}**?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} autoFocus color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🆕 Image Viewer Modal */}
      <Modal
        open={imageModalOpen}
        onClose={handleImageModalClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleImageModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <h3 className="text-2xl font-bold text-[#44403c] mb-4" id="image-modal-title">
            Donation Photos
          </h3>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDonation?.photos?.map((photo, index) => (
              <Box key={index} className="flex flex-col items-center">
                <img
                  src={photo}
                  alt={`Donation ${selectedDonation._id} - ${index}`}
                  className="w-full object-contain rounded-md"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}