import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, deleteProduct, fetchRecommendations } from "../../../actions/products";
import { addToCart } from "../../../actions/cart";
import AddReviewSection from "./AddReviewSection";
import ProductCarousel from "../../TrendingStyles/Categories/ProductCarousel";
import { FaTrash, FaShareAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// --- Sub-components (Unchanged) ---

const ImageGallery = ({ images, title, mainImage, setMainImage }) => (
  <div>
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#dcc5b2] bg-white">
      <img
        src={mainImage || "https://placehold.co/600x600"}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
    {images?.length > 1 && (
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
              img === mainImage ? "border-[#ccb5a2]" : "border-transparent"
            }`}
            onClick={() => setMainImage(img)}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProductHeader = ({ title, brand, category, user, creator, onShare, onDelete }) => (
  <div>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-[#b8a18f]">{brand || "Brand"}</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#5a4e46]">{title}</h1>
        <p className="mt-1 text-sm text-[#857262]">Category: {category}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button onClick={onShare} className="rounded-full p-2 text-[#857262] transition hover:bg-[#dfd0b8] hover:text-[#5a4e46]">
          <FaShareAlt size={18} />
        </button>
        {user?._id === creator?._id && (
          <button onClick={onDelete} className="rounded-full p-2 text-[#cb6d6a] transition hover:bg-[#cb6d6a]/10">
            <FaTrash size={18} />
          </button>
        )}
      </div>
    </div>
  </div>
);

const ProductPricing = ({ price, discount }) => {
    const discountedPrice = discount ? price - (price * discount) / 100 : price;
    return (
        <div className="my-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#3d3327]">₹{discountedPrice.toFixed(2)}</span>
            {discount > 0 && (
                <>
                    <span className="text-xl font-medium text-[#ac9887] line-through">₹{price.toFixed(2)}</span>
                    <span className="rounded-full bg-[#a3b18a]/20 px-3 py-1 text-sm font-semibold text-[#588157]">
                        {discount}% OFF
                    </span>
                </>
            )}
        </div>
    );
};

const ProductVariants = ({ variants, label }) => (
  variants?.length > 0 && (
    <div className="mb-6">
      <strong className="block text-sm font-medium text-[#5a4e46]">{label}:</strong>
      <div className="mt-2 flex flex-wrap gap-3">
        {variants.map((variant) => (
          <span key={variant} className="rounded-md bg-[#dfd0b8] px-3 py-1.5 text-sm font-medium text-[#5a4e46]">
            {variant}
          </span>
        ))}
      </div>
    </div>
  )
);

const QuantitySelector = ({ quantity, setQuantity, stock }) => (
  stock > 0 && (
    <div className="mb-6 flex items-center gap-4">
      <strong className="text-sm font-medium text-[#5a4e46]">Quantity:</strong>
      <div className="flex items-center">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="h-10 w-10 rounded-l-md border border-[#dcc5b2] text-xl font-bold text-[#857262] transition hover:bg-[#dfd0b8] disabled:opacity-50">
          -
        </button>
        <span className="flex h-10 w-14 items-center justify-center border-y border-[#dcc5b2] text-lg font-medium text-[#5a4e46]">{quantity}</span>
        <button onClick={() => setQuantity(q => Math.min(stock, q + 1))} disabled={quantity >= stock} className="h-10 w-10 rounded-r-md border border-[#dcc5b2] text-xl font-bold text-[#857262] transition hover:bg-[#dfd0b8] disabled:opacity-50">
          +
        </button>
      </div>
    </div>
  )
);

// --- Main ProductDetails Component ---

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const { product, isLoading, recommendedProducts } = useSelector((state) => state.productsData);
  const user = useSelector((state) => state.auth?.authData?.result);

  const [mainImage, setMainImage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  
  useEffect(() => {
    if (id) {
        dispatch(getProductById(id));
        dispatch(fetchRecommendations(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
        setMainImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => dispatch(addToCart(product, quantity));

  const handleBuyNow = () => {
    dispatch(addToCart(product, quantity));
    navigate("/checkout");
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct(id));
    setIsDeleteDialogOpen(false);
    navigate(-1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: product.description, url: window.location.href });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2500);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (isLoading || !product) {
    return <div className="bg-[#faf7f3] p-10 text-center text-gray-500 min-h-screen">Loading Product...</div>;
  }

  const { stock } = product;

  return (
    <div className="bg-[#faf7f3]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          <ImageGallery images={product.images} title={product.title} mainImage={mainImage} setMainImage={setMainImage} />

          <div className="flex flex-col">
            <ProductHeader 
              title={product.title} 
              brand={product.brand} 
              category={product.category}
              user={user}
              creator={product.creator}
              onShare={handleShare}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
            <ProductPricing price={product.price} discount={product.discount} />
            <p className="text-base leading-relaxed text-[#857262]">{product.description}</p>
            
            <div className="mt-6">
                <ProductVariants variants={product.sizes} label="Available Sizes" />
                <ProductVariants variants={product.colors} label="Available Colors" />
            </div>
            
            <div className={`mt-2 rounded-full px-3 py-1 text-sm font-semibold inline-block self-start ${stock > 0 ? 'bg-[#a3b18a]/20 text-[#588157]' : 'bg-[#cb6d6a]/10 text-[#cb6d6a]'}`}>
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </div>

            <div className="mt-8">
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={stock} />
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleBuyNow} disabled={stock === 0} className="flex-1 rounded-lg bg-[#ccb5a2] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#b8a18f] disabled:opacity-50 disabled:cursor-not-allowed">
                        Buy Now
                    </button>
                    <button onClick={handleAddToCart} disabled={stock === 0} className="flex-1 rounded-lg border-2 border-[#ccb5a2] bg-transparent px-6 py-3.5 text-base font-semibold text-[#ccb5a2] shadow-sm transition hover:bg-[#ccb5a2] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="mt-10 border-t border-[#dcc5b2] pt-6">
                <AddReviewSection product={product} />
            </div>
          </div>
        </div>
        
        {/* Recommendations Section */}
        {recommendedProducts?.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#dcc5b2]">
             <ProductCarousel category="You Might Also Like" products={{ products: recommendedProducts }} />
          </div>
        )}
      </div>

      {/* Custom Dialog for Delete Confirmation */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#cb6d6a]/10">
                    <FaExclamationTriangle className="h-6 w-6 text-[#cb6d6a]" />
                </div>
                <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-[#5a4e46]">Delete Product</h3>
                    <p className="mt-2 text-sm text-[#857262]">Are you sure you want to delete this product? This action cannot be undone.</p>
                </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setIsDeleteDialogOpen(false)} className="rounded-md border border-[#dcc5b2] bg-white px-4 py-2 text-sm font-medium text-[#5a4e46] shadow-sm transition hover:bg-[#faf7f3]">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="rounded-md border border-transparent bg-[#cb6d6a] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Snackbar for Share Success */}
      <div className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ${showShareSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center gap-3 rounded-full bg-[#5a4e46] px-4 py-2 text-white shadow-lg">
              <FaCheckCircle className="text-[#a3b18a]" />
              <span className="text-sm font-medium">Link copied to clipboard!</span>
          </div>
      </div>
    </div>
  );
}