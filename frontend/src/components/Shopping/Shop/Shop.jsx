import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage } from '../features/products/productActions';
import { useSearchParams } from 'react-router-dom';
import Paginate from '../components/Paginate';

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page')) || 1;

  const {
    loading,
    error,
    products,
    totalPages,
    currentPage,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ category, sort, page }));
    dispatch(setPage(page));
  }, [category, sort, page, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg shadow-sm overflow-hidden">
                <img src={product.image} alt={product.title} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Paginate
            page={currentPage}
            count={totalPages}
            onChange={(value) => {
              dispatch(setPage(value));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
};

export default Shop;