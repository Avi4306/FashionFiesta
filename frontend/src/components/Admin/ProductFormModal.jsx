import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // No longer need useSelector here
import { FaTimes } from 'react-icons/fa';

// Modified to accept initialProductData as a prop
const ProductFormModal = ({ productId, onClose, createProduct, updateProduct, initialProductData }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '', // Comma-separated
    selectedFile: '', // Main product image
    // You might have more fields like sizes, colors, stock, multiple images, etc.
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use initialProductData prop to pre-fill the form when editing
    if (productId && initialProductData) {
      setFormData({
        name: initialProductData.name,
        description: initialProductData.description,
        price: initialProductData.price,
        category: initialProductData.category,
        tags: initialProductData.tags ? initialProductData.tags.join(', ') : '',
        selectedFile: initialProductData.images && initialProductData.images.length > 0 ? initialProductData.images[0] : '', // Assuming 'images' is an array and we take the first one
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        selectedFile: '',
      });
    }
    setError(null);
  }, [productId, initialProductData]); // Depend on initialProductData instead of existingProduct from store

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for price to ensure it's a number
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) || '' : value });
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

    const productData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    let result;
    if (productId) {
      result = await dispatch(updateProduct(productId, productData));
    } else {
      result = await dispatch(createProduct(productData));
    }

    if (result.success) {
      onClose();
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
          {productId ? 'Edit Product' : 'Create New Product'}
        </h3>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
              required
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-[#aa5a44] focus:border-[#aa5a44]"
              required
            />
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
            <label htmlFor="selectedFile" className="block text-sm font-medium text-gray-700">Main Image</label>
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
              {submitting ? 'Saving...' : (productId ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;