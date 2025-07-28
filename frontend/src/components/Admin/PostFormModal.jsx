// client/src/components/Admin/PostFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa'; // For a close icon

const PostFormModal = ({ postId, onClose, createPost, updatePost }) => {
  const dispatch = useDispatch();
  const existingPost = useSelector((state) =>
    postId ? state.posts.posts.find((p) => p._id === postId) : null
  );

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    tags: '', // Will be comma-separated string
    selectedFile: '', // For image upload base64
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId && existingPost) {
      setFormData({
        title: existingPost.title,
        message: existingPost.message,
        tags: existingPost.tags ? existingPost.tags.join(', ') : '',
        selectedFile: existingPost.selectedFile || '', // Pre-fill if image exists
      });
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        message: '',
        tags: '',
        selectedFile: '',
      });
    }
    setError(null); // Clear errors on modal open/ID change
  }, [postId, existingPost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, selectedFile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean), // Convert tags string to array
    };

    let result;
    if (postId) {
      result = await dispatch(updatePost(postId, postData));
    } else {
      result = await dispatch(createPost(postData));
    }

    if (result.success) {
      onClose(); // Close modal on success
    } else {
      setError(result.message || 'An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#faf7f3] p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
        >
          <FaTimes />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-[#44403c]">
          {postId ? 'Edit Post' : 'Create New Post'}
        </h3>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
            />
          </div>
          <div>
            <label htmlFor="selectedFile" className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="selectedFile"
              id="selectedFile"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F0E4D3] file:text-[#44403c] hover:file:bg-[#e0d4c3]"
            />
            {formData.selectedFile && (
              <img src={formData.selectedFile} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : (postId ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;