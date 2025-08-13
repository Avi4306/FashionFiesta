import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  updateAdminUserPassword,
  deleteAdminUser
} from '../../actions/admin';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import ConfirmationModal from './ConfirmationModal.jsx';
import UserFormModal from './UserFormModal.jsx';

// Skeleton row component for users
const UserSkeletonRow = () => (
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

export default function AdminUserManagement() {
  const dispatch = useDispatch();
  const { users, usersPagination, error, isLoading } = useSelector((state) => state.admin);
  const authData = useSelector((state) => state.auth.authData);
  const currentUserId = authData?.result?._id;

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserIdForPassword, setSelectedUserIdForPassword] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Role change
  const [showConfirmRoleModal, setShowConfirmRoleModal] = useState(false);
  const [roleChangeUserId, setRoleChangeUserId] = useState(null);
  const [newRoleToSet, setNewRoleToSet] = useState('');
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);

  // Deletion
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create / password update
  const [isCreatingOrUpdating, setIsCreatingOrUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAdminUsers(currentPage, usersPerPage));
  }, [dispatch, currentPage, usersPerPage]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Role change handlers
  const handleRoleChangeClick = (userId, newRole) => {
    setRoleChangeUserId(userId);
    setNewRoleToSet(newRole);
    setShowConfirmRoleModal(true);
  };

  const handleConfirmRoleChange = async () => {
    setShowConfirmRoleModal(false);
    setIsRoleUpdating(true);
    const result = await dispatch(updateAdminUserRole(roleChangeUserId, newRoleToSet));
    setIsRoleUpdating(false);

    if (result.success) {
      setSnackbarMessage(`User role updated to ${newRoleToSet}.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      dispatch(getAdminUsers(currentPage, usersPerPage));
    } else {
      setSnackbarMessage(result.message || 'Failed to update role.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setRoleChangeUserId(null);
    setNewRoleToSet('');
  };

  const handleCancelRoleChange = () => {
    setShowConfirmRoleModal(false);
    setRoleChangeUserId(null);
    setNewRoleToSet('');
  };

  // Deletion handlers
  const handleDeleteUserClick = (userId) => {
    if (userId === currentUserId) {
      setSnackbarMessage("You cannot delete your own account from here.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    setUserToDeleteId(userId);
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDeleteUser = async () => {
    setShowConfirmDeleteModal(false);
    setIsDeleting(true);
    const result = await dispatch(deleteAdminUser(userToDeleteId));
    setIsDeleting(false);
    setUserToDeleteId(null);

    if (result.success) {
      setSnackbarMessage("User deleted successfully.");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        dispatch(getAdminUsers(currentPage, usersPerPage));
      }, 100);
    } else {
      setSnackbarMessage(result.message || 'Failed to delete user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCancelDeleteUser = () => {
    setShowConfirmDeleteModal(false);
    setUserToDeleteId(null);
  };

  // Modal open/close
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleOpenPasswordModal = (userId) => {
    setSelectedUserIdForPassword(userId);
    setIsPasswordModalOpen(true);
  };

  const handleCloseCreateModal = (operationSuccess = false, message = '') => {
    setIsCreateModalOpen(false);
    setIsCreatingOrUpdating(false);
    if (operationSuccess) {
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setCurrentPage(1);
      dispatch(getAdminUsers(1, usersPerPage));
    } else if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleClosePasswordModal = (operationSuccess = false, message = '') => {
    setIsPasswordModalOpen(false);
    setSelectedUserIdForPassword(null);
    setIsCreatingOrUpdating(false);
    if (operationSuccess) {
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= usersPagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = usersPagination.totalPages;
    const maxButtonsToShow = 5;

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2) + 1);
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxButtonsToShow / 2) - 1);

      if (currentPage < maxButtonsToShow - 1) endPage = maxButtonsToShow - 1;
      if (currentPage > totalPages - (maxButtonsToShow - 2)) startPage = totalPages - (maxButtonsToShow - 2);

      if (startPage > 2) buttons.push('...');
      for (let i = startPage; i <= endPage; i++) buttons.push(i);
      if (endPage < totalPages - 1) buttons.push('...');
      if (totalPages > 1) buttons.push(totalPages);
    }

    return buttons.map((pageNumber, index) => (
      <button
        key={index}
        onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
        disabled={
          typeof pageNumber !== 'number' ||
          currentPage === pageNumber ||
          isLoading ||
          isDeleting ||
          isCreatingOrUpdating ||
          isRoleUpdating
        }
        className={`px-3 py-1 rounded-md transition-colors
          ${typeof pageNumber !== 'number'
            ? 'text-gray-500 cursor-default'
            : currentPage === pageNumber
            ? 'bg-[#aa5a44] text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          disabled:opacity-50`}
      >
        {pageNumber}
      </button>
    ));
  };

  const noUsersFound = users.length === 0 && usersPagination.totalItems === 0 && !isLoading;
  const noUsersOnCurrentPage = users.length === 0 && usersPagination.totalItems > 0 && !isLoading;

  if (noUsersFound) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[#44403c]">No Users Found</h2>
        <p className="text-[#78716c]">It looks like there are no users to manage yet.</p>
        <button
          onClick={handleOpenCreateModal}
          className="mt-6 px-6 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
        >
          Create New User
        </button>
      </div>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }} className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0, color: '#44403c' }}>
          User Management
        </Typography>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
          disabled={isCreatingOrUpdating || isDeleting || isRoleUpdating}
        >
          {isCreatingOrUpdating ? 'Creating...' : 'Create New User'}
        </button>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && users.length === 0 ? (
              Array.from({ length: usersPerPage }).map((_, index) => <UserSkeletonRow key={index} />)
            ) : noUsersOnCurrentPage ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-600">
                  No users found on this page. Try navigating to another page.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChangeClick(user._id, e.target.value)}
                      disabled={
                        isDeleting ||
                        isCreatingOrUpdating ||
                        (isRoleUpdating && roleChangeUserId === user._id)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44] text-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="pending_designer">Pending Designer</option>
                      <option value="designer">Designer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenPasswordModal(user._id)}
                      className="text-[#aa5a44] hover:text-[#8b4837] mr-3"
                      disabled={isCreatingOrUpdating || isDeleting || isRoleUpdating}
                    >
                      Set Password
                    </button>
                    <button
                      onClick={() => handleDeleteUserClick(user._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={
                        user._id === currentUserId ||
                        isDeleting ||
                        isCreatingOrUpdating ||
                        isRoleUpdating
                      }
                    >
                      {isDeleting && userToDeleteId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {usersPagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading || isDeleting || isCreatingOrUpdating || isRoleUpdating}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === usersPagination.totalPages || isLoading || isDeleting || isCreatingOrUpdating || isRoleUpdating}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <UserFormModal
          mode="create"
          onClose={handleCloseCreateModal}
          createUser={createAdminUser}
          setIsSubmitting={setIsCreatingOrUpdating}
        />
      )}

      {/* Update Password Modal */}
      {isPasswordModalOpen && (
        <UserFormModal
          mode="password"
          userId={selectedUserIdForPassword}
          onClose={handleClosePasswordModal}
          updatePassword={updateAdminUserPassword}
          setIsSubmitting={setIsCreatingOrUpdating}
        />
      )}

      {/* Role Change Confirmation */}
      {showConfirmRoleModal && (
        <ConfirmationModal
          message={`Are you sure you want to change this user's role to "${newRoleToSet}"?`}
          onConfirm={handleConfirmRoleChange}
          onCancel={handleCancelRoleChange}
          text = {'Change Role'}
        />
      )}

      {/* Delete Confirmation */}
      {showConfirmDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleConfirmDeleteUser}
          onCancel={handleCancelDeleteUser}
          text = {'Delete'}
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
    </Box>
  );
}