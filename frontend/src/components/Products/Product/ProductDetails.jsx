import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../actions/products";
import AddReviewSection from "./AddReviewSection";
// import { addToCart } from "../../actions/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.productsData);
  const user = useSelector((state) => state.auth?.authData?.result);

  useEffect(() => {
    if (id) dispatch(getProductById(id));
  }, [dispatch, id]);

  if (isLoading || !product) return <div className="text-center p-10 text-text-secondary">Loading...</div>;

  const {
    title,
    description,
    price,
    discount,
    images,
    colors,
    sizes,
    brand,
    category,
    stock,
    rating,
    reviews,
  } = product;

  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const handleAddToCart = () => {
    dispatch(addToCart(product._id));
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product._id));
    // Navigate to checkout or payment
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={images?.[0] || "https://placehold.co/500x500"}
          alt={title}
          className="w-full object-cover rounded-xl border border-gray-200"
        />
        {/* Thumbnail Gallery (optional) */}
        {images?.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                className="w-20 h-20 object-cover rounded-md border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">{title}</h2>
        {brand && (
          <p className="text-sm text-gray-500 mb-2">
            <strong>Brand:</strong> {brand}
          </p>
        )}
        {category && (
          <p className="text-sm text-gray-500 mb-4">
            <strong>Category:</strong> {category}
          </p>
        )}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-[#aa5a44]">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <>
              <span className="line-through text-gray-400">₹{price}</span>
              <span className="text-green-600 font-semibold">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4">{description}</p>

        {/* Sizes */}
        {sizes?.length > 0 && (
          <div className="mb-4">
            <strong className="block mb-1 text-gray-700">Sizes:</strong>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="border px-3 py-1 rounded-md text-sm text-gray-700"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {colors?.length > 0 && (
          <div className="mb-4">
            <strong className="block mb-1 text-gray-700">Colors:</strong>
            <div className="flex gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                ></span>
              ))}
            </div>
          </div>
        )}

        {/* Stock */}
        <p className="text-sm mb-4 text-gray-500">
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="bg-[#aa5a44] text-white py-2 px-4 rounded-lg hover:bg-[#8e4738]"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={stock === 0}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>

        {/* Rating */}
        <div className="mt-6">
          <strong className="text-gray-800">Rating:</strong>{" "}
          <span className="text-yellow-500 font-semibold">{rating.toFixed(1)} / 5</span>
        </div>

        {/* Reviews */}
        {reviews?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews</h3>
            <div className="space-y-2">
              {reviews.map((rev, i) => (
                <div key={i} className="border rounded-md p-3 bg-gray-50">
                  <p className="text-sm text-gray-700">{rev.comment}</p>
                  <p className="text-xs text-gray-500">Rating: {rev.rating}/5</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <AddReviewSection productId={id}/>
      </div>
    </div>
  );
}
