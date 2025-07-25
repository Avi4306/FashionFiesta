import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../actions/products";
import ProductCard from "./Product/Product";
import Pagination from "../Pagination/Pagination";

const Products = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";

  const { products, isLoading, totalPages, currentPage, totalProducts } = useSelector(
    (state) => state.productsData
  );

  useEffect(() => {
    dispatch(getProducts(category, page, sort));
  }, [dispatch, category, page, sort]);

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
          Products in "{category}" ({totalProducts})
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
            <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default Products;