import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const renderStars = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    const totalStars = 5;

    for (let i = 0; i < totalStars; i++) {
      stars.push(
        <span key={i} className={i < filledStars ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <div className="relative w-full h-40">
        <img
          src={
            hovered && product.images?.[1]
              ? product.images[1]
              : product.images?.[0] || "/placeholder.png"
          }
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Optional Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition">
          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition">
            Quick View →
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 bg-white">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="text-red-600 font-semibold text-sm">₹{discountedPrice.toFixed(2)}</p>
        {product.discount > 0 && (
          <p className="text-xs text-gray-500 line-through">₹{product.price}</p>
        )}
        <div className="mt-1 text-xs text-gray-700 flex items-center">
          {renderStars(product.rating || 0)}
          <span className="ml-1">({product.rating || "0"})</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;