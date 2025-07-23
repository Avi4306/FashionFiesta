import React, { useState, useEffect } from "react";
import CreateProduct from "./CreateProduct";
import Product from "./Product/Product";
import Pagination from "../Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../actions/products";

const Products = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const { products, isLoading, totalPages } = useSelector((state) => state.productsData);

  useEffect(() => {
    dispatch(getAllProducts(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          ➕ New Product
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          <Pagination page={page} count={totalPages} onChange={handlePageChange} />
        </>
      )}

      <CreateProduct isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Products;