import React, { useState, useEffect } from "react";
import CreateProduct from "./CreateProduct";
import Product from "./Product/Product";
import Pagination from "../Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/products";

const Products = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const { products, isLoading, totalPages } = useSelector((state) => state.productsData);

  useEffect(() => {
    dispatch(getProducts(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Products</h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {/* Bottom Left Button and Pagination */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              ➕ New Product
            </button>

            <Pagination page={page} count={totalPages} onChange={handlePageChange} />
          </div>
        </>
      )}

      <CreateProduct isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Products;