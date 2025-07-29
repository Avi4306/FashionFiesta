import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPosts, deleteAdminPost, createAdminPost, updateAdminPost } from '../../actions/admin.js';
import { Link } from 'react-router-dom';
import PostFormModal from './PostFormModal.jsx'; // Make sure this component exists
import ConfirmationModal from './ConfirmationModal.jsx'; // Assuming this component is available or defined here
import { Alert, Snackbar } from '@mui/material'; // Importing Alert and Snackbar for better error/success messages

// Skeleton row component for posts
const PostSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex justify-end gap-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </td>
  </tr>
);

const AdminPostManagement = () => {
  const dispatch = useDispatch();
  // Access posts, pagination info, loading state, and error from the Redux store
  const { posts, postsPagination, isLoading, error } = useSelector((state) => state.admin); // Alias 'loading' to 'isLoading'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null); // For editing: ID of the post being edited

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // You can make this configurable if needed

  // State for delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);

  // Local loading states for individual operations
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingOrUpdating, setIsCreatingOrUpdating] = useState(false);

  // Snackbar for success/error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Dispatch the action with current page and limit
    dispatch(getAdminPosts(currentPage, postsPerPage));
  }, [dispatch, currentPage, postsPerPage]); // Re-fetch when page or limit changes

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (id) => {
    setPostToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDeleteId) {
      setIsDeleting(true); // Start deleting loading
      setShowConfirmModal(false); // Close modal immediately
      const result = await dispatch(deleteAdminPost(postToDeleteId));
      setIsDeleting(false); // End deleting loading
      setPostToDeleteId(null);

      if (result.success) {
        setSnackbarMessage('Post deleted successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        // After deletion, re-fetch the current page to ensure consistency
        // and handle cases where the last item on a page was deleted.
        // If the current page becomes empty, ideally navigate to the previous page.
        setTimeout(() => {
          dispatch(getAdminPosts(currentPage, postsPerPage));
        }, 100); // Small delay to allow backend to update total counts
      } else {
        setSnackbarMessage(result.message || 'Failed to delete post.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPostToDeleteId(null);
  };

  const handleOpenCreateModal = () => {
    setCurrentPostId(null); // Clear current post ID for creation
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setCurrentPostId(id); // Set current post ID for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = async (operationSuccess = false, message = '') => {
    setIsModalOpen(false);
    setCurrentPostId(null); // Clear ID when modal closes
    setIsCreatingOrUpdating(false); // Reset local loading state

    if (operationSuccess) {
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // After closing the modal (after create/update), re-fetch to see changes
      // For creation, it's often best to go back to page 1 to see the new item.
      if (!currentPostId) { // If it was a create operation (postId was null)
        setCurrentPage(1); // Go to the first page
        dispatch(getAdminPosts(1, postsPerPage)); // Re-fetch first page
      } else { // If it was an update operation
        dispatch(getAdminPosts(currentPage, postsPerPage)); // Re-fetch current page
      }
    } else if (message) { // If there was an error message from the modal
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= postsPagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = postsPagination.totalPages;
    const maxButtonsToShow = 5; // Max number of page buttons to display directly

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);

      // Logic for showing ellipsis and a range of pages around current page
      let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2) + 1);
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxButtonsToShow / 2) - 1);

      if (currentPage < maxButtonsToShow - 1) {
        endPage = maxButtonsToShow - 1;
      }
      if (currentPage > totalPages - (maxButtonsToShow - 2)) {
        startPage = totalPages - (maxButtonsToShow - 2);
      }

      if (startPage > 2) {
        buttons.push('...'); // Ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      if (endPage < totalPages - 1) {
        buttons.push('...'); // Ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        buttons.push(totalPages);
      }
    }

    return buttons.map((pageNumber, index) => (
      <button
        key={index} // Using index as key for ellipsis, otherwise pageNumber is better
        onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
        disabled={typeof pageNumber !== 'number' || currentPage === pageNumber || isLoading || isDeleting || isCreatingOrUpdating}
        className={`px-3 py-1 rounded-md transition-colors
          ${typeof pageNumber !== 'number' ? 'text-gray-500 cursor-default' :
            currentPage === pageNumber ? 'bg-[#aa5a44] text-white' :
            'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          disabled:opacity-50`}
      >
        {pageNumber}
      </button>
    ));
  };


  // Differentiate between no posts at all and no posts on the current page
  const noPostsFound = posts.length === 0 && postsPagination.totalItems === 0 && !isLoading;
  const noPostsOnCurrentPage = posts.length === 0 && postsPagination.totalItems > 0 && !isLoading;


  if (noPostsFound) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[#44403c]">No Posts Found</h2>
        <p className="text-[#78716c]">It looks like there are no posts to manage yet.</p>
        <button
          onClick={handleOpenCreateModal}
          className="mt-6 px-6 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
        >
          Create New Post
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#44403c]">Manage Blog Posts</h2>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
          disabled={isCreatingOrUpdating} // Disable button while creating/updating
        >
          {isCreatingOrUpdating ? 'Creating...' : 'Create New Post'}
        </button>
      </div>

      {error && ( // Display general errors from Redux state
        <Alert severity="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creator
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? ( // Show skeleton rows if isLoading is true
              Array.from({ length: postsPerPage }).map((_, index) => (
                <PostSkeletonRow key={index} />
              ))
            ) : noPostsOnCurrentPage ? ( // Show "No posts on this page" if applicable
              <tr>
                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                  No posts found on this page. Try navigating to another page.
                </td>
              </tr>
            ) : ( // Otherwise, render the posts
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/style-diaries/${post._id}`} className="text-[#aa5a44] hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.tags ? post.tags.join(', ') : 'No Tags'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditModal(post._id)}
                      className="text-[#aa5a44] hover:text-[#8b4837] mr-3"
                      disabled={isDeleting || isCreatingOrUpdating} // Disable while other ops are active
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isDeleting || isCreatingOrUpdating} // Disable while other ops are active
                    >
                      {isDeleting && postToDeleteId === post._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {postsPagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2"> {/* Reduced space-x for more buttons */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading || isDeleting || isCreatingOrUpdating}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {renderPaginationButtons()} {/* Render dynamic page buttons */}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === postsPagination.totalPages || isLoading || isDeleting || isCreatingOrUpdating}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <PostFormModal
          postId={currentPostId}
          onClose={handleCloseModal}
          createPost={createAdminPost}
          updatePost={updateAdminPost}
          // Pass the current posts data to the modal if editing
          initialPostData={currentPostId ? posts.find(p => p._id === currentPostId) : null}
          setIsSubmitting={setIsCreatingOrUpdating} // Pass setter for local loading state
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

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
    </div>
  );
};

export default AdminPostManagement;