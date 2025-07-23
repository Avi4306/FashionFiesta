import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const renderStars = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    const totalStars = 5;

    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }

    return stars;
  };

  return (
    <Link to={`/products/${product._id}`} className="block border rounded-lg p-4 hover:shadow-md">
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.title}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
      <p className="text-red-600 font-medium">₹{discountedPrice.toFixed(2)}</p>
      {product.discount > 0 && (
        <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
      )}
      <div className="mt-1 text-sm">
        {renderStars(product.rating || 0)}{" "}
        <span className="text-gray-600 ml-1">({product.rating || "0"})</span>
      </div>
    </Link>
  );
};

export default ProductCard;
