import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../actions/products";
import ProductCard from "../Products/Product/Product";
import { Link } from "react-router-dom";

const TrendingStyles = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.productsData);

  useEffect(() => {
    dispatch(getAllProducts(1));
  }, [dispatch]);

  const trendingProducts = products?.filter((p) =>
    p.tags?.includes("trending")
  );

  const categoryMap = trendingProducts?.reduce((acc, product) => {
    if (!product.category) return acc;
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🔥 Trending Styles</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : !trendingProducts?.length ? (
        <p className="text-center text-gray-500">No trending styles found.</p>
      ) : (
        Object.entries(categoryMap).map(([category, items]) => (
          <div key={category} className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-700">{category}</h2>
              <Link
                to={`/products?category=${encodeURIComponent(category)}`}
                className="text-sm text-blue-600 hover:underline"
              >
                See All →
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-2">
              {items.map((product) => (
                <div key={product._id} className="min-w-[240px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default TrendingStyles;