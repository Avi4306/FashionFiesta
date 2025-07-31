// src/components/User/ApplyDesignForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

import { applyForDesignerRole } from '../../actions/user';
import { CLEAR_ERROR } from '../../constants/actionTypes'; // Assuming you have this

export default function ApplyDesignerForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Ensure 'error' and 'isLoading' are correctly destructured from state.auth
  const { error, isLoading } = useSelector((state) => state.auth);
  const authData = useSelector((state) => state.auth.authData);
  const userId = authData?.result?._id;

  const [formData, setFormData] = useState({
    message: '',
    portfolioLink: authData?.result?.designerDetails?.portfolioUrl || '',
    yearsExperience: '',
    specializations: '',
    whyYou: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarOpen(false); // Close any existing snackbar before new submission

    if (!userId) {
      setSnackbarMessage("User not logged in or ID not found. Please log in.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    dispatch({ type: CLEAR_ERROR }); // Clear previous errors in Redux state

    // Dispatch the action and await its return value
    // The action now returns { success: boolean, message: string, data?: any }
    const result = await dispatch(applyForDesignerRole(userId, formData));

    if (result.success) {
      setSnackbarMessage(result.message); // Use message from action result
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Delay navigation to allow Snackbar to be seen
      setTimeout(() => {
        navigate('/'); // Navigate to homepage after 2 seconds
      }, 2000);
    } else {
      // Use the error message from the action result or the Redux store
      setSnackbarMessage(result.message || error || "Failed to submit application. Please try again.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (!userId) {
    return <div className="text-center py-10 text-gray-500">Please log in to apply.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#faf7f3] rounded-xl shadow-md border border-[#f0e4d3] mt-10 mb-10">
      <h2 className="text-2xl font-semibold text-[#44403c] mb-6 text-center">Apply to be a Designer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#44403c] mb-1">Tell us about yourself and why you want to be a designer:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ccb5a2]"
            placeholder="Share your passion for design..."
            required
          />
        </div>
        <div>
          <label htmlFor="portfolioLink" className="block text-sm font-medium text-[#44403c] mb-1">Portfolio Link (Optional):</label>
          <input
            type="url"
            id="portfolioLink"
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ccb5a2]"
            placeholder="e.g., https://your-portfolio.com"
          />
        </div>

        <div>
          <label htmlFor="yearsExperience" className="block text-sm font-medium text-[#44403c] mb-1">Years of Design Experience:</label>
          <input
            type="number"
            id="yearsExperience"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            min="0"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ccb5a2]"
            placeholder="e.g., 3"
          />
        </div>

        <div>
          <label htmlFor="specializations" className="block text-sm font-medium text-[#44403c] mb-1">Design Specializations (e.g., "Couture, Sustainable Fashion, Bridal"):</label>
          <textarea
            id="specializations"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ccb5a2]"
            placeholder="List your key design areas..."
          />
        </div>

        <div>
          <label htmlFor="whyYou" className="block text-sm font-medium text-[#44403c] mb-1">What makes you a unique designer? (Optional):</label>
          <textarea
            id="whyYou"
            name="whyYou"
            value={formData.whyYou}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ccb5a2]"
            placeholder="Highlight your unique selling points..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#aa5a44] text-white py-2 px-4 rounded-lg hover:bg-[#8e4738] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>

        {/* The error message from Redux is still displayed below the button as a fallback */}
        {error && (
          <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
        )}
      </form>

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
    </div>
  );
}
