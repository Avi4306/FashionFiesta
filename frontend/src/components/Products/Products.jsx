import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../actions/products";
import ProductCard from "./Product/Product";
import Pagination from "../Pagination/Pagination";
import ProductCardSkeleton from "./Product/ProductCardSkeleton";
import { FaCheckCircle } from "react-icons/fa";
import { addToCart } from "../../actions/cart";

const Products = ({ navigateOnCategoryChange = true }) => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";

  const { products, isLoading, totalPages, currentPage, totalProducts, reFetchTrigger } = useSelector(
    (state) => state.productsData
  );

  const itemsPerPage = 12;
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 2500);
  };

  // Fetch products when filters change
  useEffect(() => {
    dispatch(getProducts(category, page, sort));
  }, [dispatch, category, page, sort, reFetchTrigger]);

  const handlePageChange = (newPage) => {
    setSearchParams({ sort, page: newPage });
  };

  const handleSortChange = (e) => {
    setSearchParams({ sort: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e) => {
  const selected = e.target.value;
  const newCategory = selected === "All" ? "" : selected;

  setSearchParams({ sort, page: 1 });

  if (navigateOnCategoryChange) {
    if (newCategory) {
      navigate(`/category/${newCategory}`);
    } else {
      navigate(`/category`);
    }
  } else {
    // Just trigger fetch manually by updating URL param
    dispatch(getProducts(newCategory, 1, sort));
  }
};

  const availableCategories = ["All", "Men", "Women", "Kids", "Accessories"];

  const formatCategoryLabel = (slug) =>
    slug === "All" ? "All" : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {category ? `Products in ${category}` : "All Products"} ({totalProducts})
        </h2>

        <div className="flex gap-4 flex-wrap">
          {/* Category Filter */}
          <select
            value={category || "All"}
            onChange={handleCategoryChange}
            className="border px-3 py-2 rounded-md"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
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
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                creator={product.creator}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </>
      )}

      {/* Add to Cart Snackbar */}
      <div
        className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ${
          showAddToCartSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        role="alert"
      >
        <div className="flex items-center gap-3 rounded-full bg-[#5a4e46] px-4 py-2 text-white shadow-lg">
          <FaCheckCircle className="text-[#a3b18a]" />
          <span className="text-sm font-medium">Item added to cart!</span>
        </div>
      </div>
    </div>
  );
};

export default Products;