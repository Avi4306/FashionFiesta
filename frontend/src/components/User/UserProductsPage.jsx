import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProducts } from '../../actions/user';
import { Link, useParams } from 'react-router-dom';

export default function UserProductsPage() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get user ID from URL
  const { products, isLoading } = useSelector(state => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProducts(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading all products...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-[#44403c] mb-6">All Products</h2>
      <Link to={`/user/${id}`} className="text-sm text-[#aa5a44] hover:underline mb-6 block">
        &larr; Back to Profile
      </Link>
      {products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <Link 
              to={`/products/${product._id}`}
              key={product._id}
              className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
            >
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-[#44403c]">{product.title}</h4>
                <p className="text-sm text-[#78716c] line-clamp-2">{product.description || "No description"}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#78716c]">This user has no products to display.</p>
      )}
    </div>
  );
}