import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOutfits,
  fetchTopOutfits,
  likeOutfit,
  deleteOutfit,
} from '../../actions/outfit';
import Top3Outfits from './Top3Outfits';
import OutfitGallery from './OutfitGallery';
import SubmitOutfit from './SubmitOutfit';

import {
  Skeleton,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function OutfitOfTheWeek() {
  const dispatch = useDispatch();
  const { outfits, topOutfits, loading } = useSelector((state) => state.outfit);
  const user = useSelector((state) => state.auth.authData);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHoveringPostButton, setIsHoveringPostButton] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    dispatch(fetchOutfits(currentPage, pageSize));
    dispatch(fetchTopOutfits());
  }, [dispatch, currentPage]);

  const handleLike = (outfit) => {
    if (!user) {
      showSnackbar('Please login to like an outfit.', 'warning');
      return;
    }

    if (outfit.submittedBy === user?.result?._id) {
      showSnackbar("You can't like your own outfit.", 'error');
      return;
    }
    dispatch(likeOutfit(outfit._id));
  };

  const confirmDelete = (outfit) => {
    if (!user || (outfit.submittedBy !== user?.result?._id)) {
      showSnackbar("You can't delete someone else's outfit.", 'error');
      return;
    }

    setOutfitToDelete(outfit._id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    await dispatch(deleteOutfit(outfitToDelete));
    await dispatch(fetchOutfits(currentPage, pageSize));
    await dispatch(fetchTopOutfits());
    setDeleteModalOpen(false);
    setOutfitToDelete(null);
    showSnackbar('Outfit deleted successfully.', 'success');
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setOutfitToDelete(null);
  };

  const handleOpenSubmitModal = () => setIsSubmitModalOpen(true);
  const handleCloseSubmitModal = () => setIsSubmitModalOpen(false);

  if (!loading && outfits.length === 0 && topOutfits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#fff9f5] border border-[#f5e7d8] p-10 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-[#aa5a44] mb-4">👗 Outfit of the Week</h2>
          <p className="text-gray-600 text-lg">No outfits submitted yet. Be the first to add one!</p>
        </div>
        <SubmitButton
          onClick={handleOpenSubmitModal}
          isHovering={isHoveringPostButton}
          setIsHovering={setIsHoveringPostButton}
        />
        <SubmitOutfit isOpen={isSubmitModalOpen} onClose={handleCloseSubmitModal} />
        <SnackbarComponent {...snackbar} onClose={handleCloseSnackbar} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-[#faf7f3] border border-[#f0e4d3] rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-[#44403c] mb-6">👑 Outfit of the Week</h2>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <>
            <Top3Outfits
              topOutfits={topOutfits}
              user={user}
              handleLike={handleLike}
              handleDelete={confirmDelete}
            />
            <OutfitGallery
              outfits={outfits}
              topOutfits={topOutfits}
              user={user}
              handleLike={handleLike}
              handleDelete={confirmDelete}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
            />
          </>
        )}
      </div>

      <SubmitButton
        onClick={handleOpenSubmitModal}
        isHovering={isHoveringPostButton}
        setIsHovering={setIsHoveringPostButton}
      />
      <SubmitOutfit isOpen={isSubmitModalOpen} onClose={handleCloseSubmitModal} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Delete Outfit</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this outfit?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <SnackbarComponent {...snackbar} onClose={handleCloseSnackbar} />
    </div>
  );
}

function SnackbarComponent({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

function SubmitButton({ onClick, isHovering, setIsHovering }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 28,
        right: 100,
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        sx={{
          transition: 'width 0.6s, padding 0.6s, border-radius 0.6s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          width: isHovering ? '220px' : '48px',
          height: '48px',
          borderRadius: isHovering ? '24px' : '50%',
          padding: isHovering ? '6px 16px' : '0 12px',
          minWidth: '48px',
          backgroundColor: '#aa5a44',
          '&:hover': {
            backgroundColor: '#8e4738',
          },
        }}
      >
        <AddIcon />
        <Typography
          variant="button"
          sx={{
            whiteSpace: 'nowrap',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.3s linear 0.3s',
            marginLeft: '10px',
          }}
        >
          Post an Outfit
        </Typography>
      </Button>
    </Box>
  );
}