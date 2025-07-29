import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

// This modal will handle both user creation and password updates
const UserFormModal = ({ mode, userId, onClose, createUser, updatePassword, setIsSubmitting }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [submittingLocal, setSubmittingLocal] = useState(false); // Local submitting state for the modal

  useEffect(() => {
    // Reset form data when mode changes or modal opens/closes
    if (mode === 'create') {
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    } else if (mode === 'password') {
      setNewPassword('');
    }
    setError(null);
    setSubmittingLocal(false);
  }, [mode, userId]); // Depend on mode and userId to reset when they change

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLocal(true);
    setIsSubmitting(true); // Notify parent component about submission
    setError(null);

    let result;
    if (mode === 'create') {
      result = await dispatch(createUser(formData));
    } else if (mode === 'password') {
      if (!newPassword) {
        setError('New password is required.');
        setSubmittingLocal(false);
        setIsSubmitting(false);
        return;
      }
      result = await dispatch(updatePassword(userId, newPassword));
    }

    if (result.success) {
      onClose(true, mode === 'create' ? 'User created successfully.' : 'Password updated successfully.');
    } else {
      setError(result.message || 'An error occurred. Please try again.');
      onClose(false, result.message || 'An error occurred.'); // Pass error message to parent
    }
    setSubmittingLocal(false);
    setIsSubmitting(false); // Reset parent's submitting state
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#faf7f3] p-8 rounded-lg shadow-2xl w-full max-w-md relative">
        <button
          onClick={() => onClose(false, '')} // Pass false for success and empty message on close
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
        >
          <FaTimes />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-[#44403c]">
          {mode === 'create' ? 'Create New User' : 'Set New Password'}
        </h3>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'create' && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
                >
                  <option value="customer">Customer</option>
                  <option value="pending_designer">Pending Designer</option>
                  <option value="designer">Designer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          {mode === 'password' && (
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false, '')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingLocal}
              className="px-4 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingLocal ? 'Saving...' : (mode === 'create' ? 'Create User' : 'Update Password')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;