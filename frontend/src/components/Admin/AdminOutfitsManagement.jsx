import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminOutfits,
  deleteAdminOutfit,
  // Removed: createAdminOutfit, updateAdminOutfit as they are no longer needed
} from '../../actions/admin';
// Removed: OutfitFormModal as it's no longer needed for create/edit
import ConfirmationModal from './ConfirmationModal';
import { Alert, Snackbar } from '@mui/material';

const OutfitSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-20 w-20 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
  </tr>
);

const AdminOutfitManagement = () => {
  const dispatch = useDispatch();
  const { outfits, outfitsPagination, isLoading, error } = useSelector((state) => state.admin);

  // Removed states related to modal for creation/editing
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentOutfitId, setCurrentOutfitId] = useState(null);
  // const [isSubmitting, setIsSubmitting] = useState(false); // No longer needed for form submission

  const [currentPage, setCurrentPage] = useState(1);
  const [outfitsPerPage] = useState(10);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [outfitToDeleteId, setOutfitToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Still needed for delete operation
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    dispatch(getAdminOutfits(currentPage, outfitsPerPage));
  }, [dispatch, currentPage, outfitsPerPage]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await dispatch(deleteAdminOutfit(outfitToDeleteId));
    setIsDeleting(false);
    setShowConfirmModal(false);
    setOutfitToDeleteId(null);
    if (result.success) {
      setSnackbarMessage('Outfit deleted successfully.');
      setSnackbarSeverity('success');
      // Re-fetch outfits to update the list after deletion
      dispatch(getAdminOutfits(currentPage, outfitsPerPage));
    } else {
      setSnackbarMessage(result.message || 'Failed to delete outfit.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handlePageChange = (page) => {
    if (page > 0 && outfitsPagination && page <= outfitsPagination.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#44403c]">Manage Outfits</h2>
        {/* Removed "Create New Outfit" button */}
        {/* Removed any "Edit" related buttons/functionality */}
      </div>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: outfitsPerPage }).map((_, i) => <OutfitSkeletonRow key={i} />)
            ) : outfits.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">No outfits found.</td>
              </tr>
            ) : (
              outfits.map(outfit => (
                <tr key={outfit._id}>
                  <td className="px-6 py-4">
                    <img src={outfit.imageUrl} alt="Outfit" className="w-20 h-20 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{outfit.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{outfit.creatorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{outfit.likes?.length || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(outfit.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {/* Removed Edit button */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => { setOutfitToDeleteId(outfit._id); setShowConfirmModal(true); }}
                      disabled={isDeleting && outfitToDeleteId === outfit._id}
                    >
                      {isDeleting && outfitToDeleteId === outfit._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {outfitsPagination?.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >Previous</button>

          {Array.from({ length: outfitsPagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-[#aa5a44] text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
            >{page}</button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === outfitsPagination.totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >Next</button>
        </div>
      )}

      {/* Removed OutfitFormModal entirely */}
      {/* {isModalOpen && (
        <OutfitFormModal
          outfitId={currentOutfitId}
          onClose={handleModalClose}
          onSubmit={(formData, id) => dispatch(updateAdminOutfit(id, formData))}
          initialData={outfits.find(o => o._id === currentOutfitId)}
          setIsSubmitting={setIsSubmitting}
        />
      )} */}

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this outfit?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminOutfitManagement;