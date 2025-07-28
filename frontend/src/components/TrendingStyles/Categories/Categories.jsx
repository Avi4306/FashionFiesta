import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarousels } from "../../../actions/products";
import ProductCarousel from "./ProductCarousel";

const Categories = () => {
  const dispatch = useDispatch();
  // Select the reFetchTrigger from the Redux store
  const { isLoading, categoryCarousels, error, reFetchTrigger } = useSelector(
    (state) => state.productsData
  );

  // Define the specific categories you want to fetch
  const specificCategories = ["Men", "Women", "Kids", "Accessories"];

  useEffect(() => {
    // The effect now runs whenever a new product is added
    // Pass the specific categories to the fetchCarousels action creator
    dispatch(fetchCarousels(specificCategories));
  }, [dispatch, reFetchTrigger]); // <-- Added specificCategories here

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      {Object.entries(categoryCarousels).map(([category, products]) => (
        // Render a carousel only if the category is in the specificCategories array
        specificCategories.includes(category) && (
          <ProductCarousel key={category} category={category} products={products} />
        )
      ))}
    </div>
  );
};

export default Categories;