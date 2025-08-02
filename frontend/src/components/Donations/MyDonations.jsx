import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyDonations,
  clearDonationListError,
  deleteDonation, // Now directly using the deleteDonation action
} from '../../actions/donation';
import {
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

/**
 * DonationCardSkeleton Component
 *
 * This component provides a placeholder "skeleton" for a donation card
 * while data is being loaded. It mimics the layout and animates with a shimmer effect.
 */
const DonationCardSkeleton = () => {
  return (
    <div className="bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3] animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-lg"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="w-full h-24 bg-gray-300 rounded-md"></div>
        <div className="w-full h-24 bg-gray-300 rounded-md"></div>
        <div className="w-full h-24 bg-gray-300 rounded-md"></div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};


/**
 * MyDonations Component
 *
 * This component displays a list of all donations submitted by the currently logged-in user.
 * It fetches the data from the backend, handles loading and error states, and provides a way
 * for the user to permanently delete a pending or scheduled donation.
 */
export default function MyDonations() {
  const dispatch = useDispatch();
  // Select donations, loading state, and errors from the Redux store
  const { donations, loading, error, deleteSuccess, deleteError } = useSelector((state) => state.donationList);
  // Get the logged-in user details to display a welcome message
  const { user } = useSelector((state) => state.auth);

  // State for managing the Snackbar (toast notifications)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  // State for managing the confirmation dialog for cancellation/deletion
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // Effect to fetch donations when the component mounts
  useEffect(() => {
    dispatch(fetchMyDonations());
  }, [dispatch]);

  // Effect to show an error or success message in the Snackbar
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    // Handle the success/error from the delete action
    if (deleteSuccess) {
      setSnackbarMessage('Donation deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Re-fetch the donations to update the UI
      dispatch(fetchMyDonations());
    }
    if (deleteError) {
      setSnackbarMessage(`Error deleting donation: ${deleteError}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error, deleteSuccess, deleteError, dispatch]);

  // Handler to close the Snackbar and clear the Redux error state
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    dispatch(clearDonationListError());
  };

  // Handler for when the "Cancel" button is clicked
  const handleCancelClick = (id) => {
    setSelectedDonationId(id);
    setOpenCancelDialog(true);
  };

  // Handler for confirming the deletion in the dialog
  const handleCancelConfirm = () => {
    if (selectedDonationId) {
      // Dispatch the new deleteDonation action instead of updating
      dispatch(deleteDonation(selectedDonationId));
    }
    setOpenCancelDialog(false);
    setSelectedDonationId(null);
  };

  // Handler to close the cancellation/deletion dialog
  const handleCancelClose = () => {
    setOpenCancelDialog(false);
    setSelectedDonationId(null);
  };

  // Styles for the card and status badges
  const cardStyle = 'bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]';
  const statusBadge = (status) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'scheduled':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'collected':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'cancelled':
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        break;
    }
    return `px-3 py-1 rounded-full text-sm font-medium ${colorClass}`;
  };

  // Render a loading spinner while data is being fetched for the first time
  if (loading && donations.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonationCardSkeleton />
        <DonationCardSkeleton />
        <DonationCardSkeleton />
        <DonationCardSkeleton />
      </div>
    );
  }

  // Render a message if the user has no donations
  if (donations.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-[#44403c]">
        <h2 className="text-3xl font-bold mb-4">My Donations</h2>
        <p className="text-lg">You haven't made any donation requests yet.</p>
        <p className="text-md mt-2">Start by donating some clothes!</p>
      </div>
    );
  }

  // Render the list of donations
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#44403c] text-center mb-8">
        My Donations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {donations.map((donation) => (
          <div key={donation._id} className={cardStyle}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-[#aa5a44]">
                {donation.itemType}
              </h3>
              <span className={statusBadge(donation.status)}>
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
              </span>
            </div>
            <p className="text-[#555] mb-2">Quantity: {donation.quantity}</p>
            <p className="text-[#555] mb-2">
              Condition:{' '}
              {donation.condition
                .replace(/_/g, ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </p>
            {donation.description && (
              <p className="text-[#555] mb-2">Description: {donation.description}</p>
            )}
            <p className="text-[#555] mb-2">
              Pickup: {donation.pickupAddress.street}, {donation.pickupAddress.city},{' '}
              {donation.pickupAddress.state} {donation.pickupAddress.zip}
            </p>
            <p className="text-[#555] mb-4">Contact: {donation.contactNumber}</p>

            {/* Photos Display */}
            {donation.photos && donation.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {donation.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Donation ${donation._id} - ${index}`}
                    className="w-full h-24 object-cover rounded-md shadow-sm"
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              {(donation.status === 'pending' || donation.status === 'scheduled') && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<TrashIcon className="h-4 w-4" />}
                  onClick={() => handleCancelClick(donation._id)}
                  className="bg-red-500 hover:bg-red-700"
                >
                  Cancel Donation
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Snackbar for notifications */}
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

      {/* Confirmation Dialog for cancelling a donation */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCancelClose}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to permanently delete this donation? This action
            cannot be undone and will remove it from your history.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            No, Keep It
          </Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}