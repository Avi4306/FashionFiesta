import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarousels } from "../../../actions/products";
import ProductCarousel from "./ProductCarousel";

const Categories = () => {
  const dispatch = useDispatch();
  const { isLoading, categoryCarousels, error } = useSelector((state) => state.productsData);

  useEffect(() => {
    dispatch(fetchCarousels());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      {Object.entries(categoryCarousels).map(([category, products]) => (
        <ProductCarousel key={category} category={category} products={products} />
      ))}
    </div>
  );
};

export default Categories;