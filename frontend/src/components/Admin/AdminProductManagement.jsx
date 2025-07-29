// client/src/components/Admin/AdminProductManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, deleteAdminProduct, createAdminProduct, updateAdminProduct } from '../../actions/admin.js'; // Import your admin product actions
import { Link } from 'react-router-dom';
import Spinner from './Spinner.jsx'; // Assuming you have a Spinner component
import ProductFormModal from './ProductFormModal.jsx'; // We'll create this next

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  // Assuming your products state looks like { products: [], isLoading: false }
  const { products, isLoading } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null); // For editing: ID of the product being edited

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      dispatch(deleteAdminProduct(id));
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentProductId(null); // Clear current product ID for creation
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setCurrentProductId(id); // Set current product ID for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProductId(null); // Clear ID when modal closes
  };

  if (isLoading) {
    return <Spinner />; // Or a simple loading message
  }

  if (!products.length && !isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[#44403c]">No Products Found</h2>
        <p className="text-[#78716c]">It looks like there are no products to manage yet.</p>
        <button
          onClick={handleOpenCreateModal}
          className="mt-6 px-6 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
        >
          Create New Product
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#44403c]">Manage Products</h2>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-[#aa5a44] text-white rounded-md hover:bg-[#8b4837] transition-colors"
        >
          Create New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designer
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/products/${product._id}`} className="text-[#aa5a44] hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price ? product.price.toFixed(2) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.creatorName || 'N/A'} {/* Assumes creator's name is in product object */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenEditModal(product._id)}
                    className="text-[#aa5a44] hover:text-[#8b4837] mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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
        <ProductFormModal
          productId={currentProductId}
          onClose={handleCloseModal}
          createProduct={createAdminProduct}
          updateProduct={updateAdminProduct}
        />
      )}
    </div>
  );
};

export default AdminProductManagement;