import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../actions/products"; // This action needs to accept category, page, and sort
import ProductCard from "./Product/Product";
import Pagination from "../Pagination/Pagination"; // This component needs to build links with all search params

const Products = () => {
  // Extract the 'category' URL parameter (e.g., from /products/category/electronics)
  const { category } = useParams();
  
  const dispatch = useDispatch();
  // Use useSearchParams to read and update query parameters (e.g., ?page=1&sort=newest)
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse 'page' from URL search params, default to 1
  const page = parseInt(searchParams.get("page")) || 1;
  // Parse 'sort' from URL search params, default to "newest"
  const sort = searchParams.get("sort") || "newest";

  // Select relevant data from the Redux store
  // Assumes productsData reducer stores products, loading state, and pagination info
  const { products, isLoading, totalPages, currentPage, totalProducts } = useSelector(
    (state) => state.productsData
  );

  // useEffect hook to dispatch the action when URL parameters change
  useEffect(() => {
    // Dispatch the getProducts action with the current category, page, and sort
    // This action will then call your backend API with these parameters
    dispatch(getProducts(category, page, sort));
  }, [dispatch, category, page, sort]); // Dependencies: re-run effect if any of these change

  // Handler for pagination changes
  const handlePageChange = (newPage) => {
    // Update URL search parameters, preserving the current sort
    setSearchParams({ sort, page: newPage });
  };

  // Handler for sort option changes
  const handleSortChange = (e) => {
    // Update URL search parameters, resetting page to 1 for new sort
    setSearchParams({ sort: e.target.value, page: 1 });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {category ? `Products in ${category}` : 'All Products'} ({totalProducts}) {/* Display "All" if no category */}
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
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            // Pass current page, total pages, and the change handler to Pagination
            // Ensure your Pagination component correctly builds links using all current search params
            <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default Products;