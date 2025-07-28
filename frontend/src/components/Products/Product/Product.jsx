import React from "react";
import { Link } from "react-router-dom";

// SVG Icons for self-contained, high-quality buttons
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BuyNowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleActionClick = (e, action) => {
    e.preventDefault(); // Prevents navigating to the product page
    e.stopPropagation(); // Stops event from bubbling further
    action(product); // Execute the passed-in action (e.g., onAddToCart)
  };

  // Star rendering logic updated with the theme colors
  const renderStars = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < filledStars ? "text-[#c39a73]" : "text-[#dcc5b2]"}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block bg-[#faf7f3] border m-4  border-[#dcc5b2] rounded-lg overflow-hidden shadow-sm hover:p-2 hover:shadow-xl transition-all duration-300 ease-in-out "
    >
      <div className="relative w-full h-80 overflow-hidden p-4 ">
        {/* Product Image */}
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 rounded-lg "
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-[#cb6d6a] text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 ">
             <div className="flex justify-center gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <button
                    onClick={(e) => handleActionClick(e, onAddToCart)}
                    className="flex items-center justify-center bg-[#faf7f3] text-[#5a4e46] text-xs font-semibold px-3 py-2 rounded-md shadow-md hover:bg-white transition-colors"
                >
                    <CartIcon /> Add to Cart
                </button>
                <button
                    onClick={(e) => handleActionClick(e, onBuyNow)}
                    className="flex items-center justify-center bg-[#ccb5a2] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-md hover:bg-[#b8a18f] transition-colors"
                >
                    <BuyNowIcon/> Buy Now
                </button>
            </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-bold text-[#5a4e46] truncate">{product.title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-semibold text-[#3d3327]">₹{discountedPrice.toFixed(2)}</p>
          {product.discount > 0 && (
            <p className="text-sm text-[#ac9887] line-through">₹{product.price.toFixed(2)}</p>
          )}
        </div>
        <div className="mt-2 flex items-center text-sm text-[#857262]">
          {renderStars(product.rating || 0)}
          <span className="ml-2">({product.numReviews || 0} reviews)</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;