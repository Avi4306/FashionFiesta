import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, deleteProduct } from "../../../actions/products";
import { addToCart } from "../../../actions/cart";
import AddReviewSection from "./AddReviewSection";
import {
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { FaTrash, FaShareAlt } from "react-icons/fa";

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const { product, isLoading } = useSelector((state) => state.productsData);
  const user = useSelector((state) => state.auth?.authData?.result);

  // State to manage the main image being displayed
  const [mainImage, setMainImage] = useState(null);

  // State to manage the delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // NEW: State for share functionality
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (isLoading || !product) {
    return (
      <div className="text-center p-10 text-text-secondary">Loading...</div>
    );
  }

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
    numReviews,
    reviews,
    creator,
  } = product;
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const handleAddToCart = () => {
    dispatch(addToCart(product, quantity));
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product, quantity));
    navigate("/checkout");
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct(id));
    navigate(-1);
    setIsDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // NEW: Function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      // Use native Web Share API if supported
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareSuccess(true);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowShareSuccess(false);
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={mainImage || "https://placehold.co/500x500"}
          alt={title}
          className="w-full object-cover rounded-xl border border-gray-200"
          loading="lazy"
        />
        {images?.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                className={`w-20 h-20 object-cover rounded-md border cursor-pointer ${
                  img === mainImage
                    ? "border-2 border-[#aa5a44]"
                    : "border-gray-200"
                }`}
                loading="lazy"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {title}
          </h2>
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Tooltip title="Share Product">
              <IconButton
                onClick={handleShare}
                className="!text-gray-500 hover:!bg-gray-100"
              >
                <FaShareAlt />
              </IconButton>
            </Tooltip>
            {user?._id === creator?._id && (
              <Tooltip title="Delete Product">
                <IconButton
                  onClick={handleDelete}
                  className="!text-red-500 hover:!bg-red-50"
                >
                  <FaTrash />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
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

        <p className="text-sm mb-4 text-gray-500">
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </p>

        {/* Quantity Selector */}
        {stock > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <strong className="text-gray-700">Quantity:</strong>
            <div className="flex items-center border rounded-md">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-12 text-center border-x outline-none text-gray-800"
                min="1"
                max={stock}
              />
              <button
                onClick={increaseQuantity}
                disabled={quantity >= stock}
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="bg-[#aa5a44] text-white py-2 px-4 rounded-lg hover:bg-[#8e4738] disabled:opacity-50"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={stock === 0}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>

        {/* Rating and Reviews */}
        <div className="mt-6">
          <strong className="text-gray-800">Rating:</strong>{" "}
          <span className="text-yellow-500 font-semibold">
            {rating?.toFixed(1) || "0.0"} / 5
          </span>
          <span className="text-gray-600 ml-2">
            ({numReviews || "0"} reviews)
          </span>
        </div>
        <AddReviewSection product={product} />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* NEW: Snackbar for "Link copied" message */}
      <Snackbar
        open={showShareSuccess}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}