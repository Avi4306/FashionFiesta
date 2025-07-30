import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../actions/products";
import ProductCard from "./Product/Product";
import Pagination from "../Pagination/Pagination";
import ProductCardSkeleton from "./Product/ProductCardSkeleton";

const Products = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";

  const { products, isLoading, totalPages, currentPage, totalProducts, reFetchTrigger } = useSelector(
    (state) => state.productsData
  );

  // 🆕 Moved itemsPerPage declaration here, before it's used in the JSX
  const itemsPerPage = 9; // Assuming your API's default limit is 9, adjust if different

  useEffect(() => {
    dispatch(getProducts(category, page, sort));
  }, [dispatch, category, page, sort, reFetchTrigger]);

  const handlePageChange = (newPage) => {
    setSearchParams({ sort, page: newPage });
  };

  const handleSortChange = (e) => {
    setSearchParams({ sort: e.target.value, page: 1 });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {category ? `Products in ${category}` : 'All Products'} ({totalProducts})
        </h2>
        <select
          value={sort}
          onChange={handleSortChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(itemsPerPage)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} creator={product.creator} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;