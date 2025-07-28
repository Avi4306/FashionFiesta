// client/src/components/Admin/AdminPostManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPosts, deleteAdminPost, createAdminPost, updateAdminPost } from '../../actions/admin.js'; // Import your admin post actions
import { Link } from 'react-router-dom';
import Spinner from './Spinner.jsx'; // Assuming you have a Spinner component
import PostFormModal from './PostFormModal.jsx'; // We'll create this next

const AdminPostManagement = () => {
  const dispatch = useDispatch();
  // Assuming your posts state looks like { posts: [], isLoading: false }
  const { posts, isLoading } = useSelector((state) => state.posts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null); // For editing: ID of the post being edited

  useEffect(() => {
    dispatch(getAdminPosts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      dispatch(deleteAdminPost(id));
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentPostId(null); // Clear current post ID for creation
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setCurrentPostId(id); // Set current post ID for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPostId(null); // Clear ID when modal closes
  };

  if (isLoading) {
    return <Spinner />; // Or a simple loading message
  }

  if (!posts.length && !isLoading) {
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
        >
          Create New Post
        </button>
      </div>

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
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/style-diaries/${post._id}`} className="text-[#aa5a44] hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.name || 'N/A'} {/* Assumes creator's name is in post object, adjust if not */}
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
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PostFormModal
          postId={currentPostId}
          onClose={handleCloseModal}
          createPost={createAdminPost}
          updatePost={updateAdminPost}
        />
      )}
    </div>
  );
};

export default AdminPostManagement;