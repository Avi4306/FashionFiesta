import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

// A helper function to render star ratings dynamically
const renderStars = (rating = 0) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex text-[#c39a73]"> {/* Themed star color */}
      {Array.from({ length: fullStars }, (_, i) => <StarIcon key={`full-${i}`} fontSize="small" />)}
      {Array.from({ length: emptyStars }, (_, i) => <StarIcon key={`empty-${i}`} className="text-[#dcc5b2]" fontSize="small" />)}
    </div>
  );
};

const ProductCarousel = ({ category, products }) => {
  const navigate = useNavigate();
  const productList = Array.isArray(products?.products) ? products.products : [];

  return (
    <div className="bg-[#fff] py-8 md:py-12">
      {/* --- Carousel Header --- */}
      <div className="flex justify-between items-center mb-6 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5a4e46] capitalize">{category}</h2>
        <Button
          variant="outlined"
          onClick={() => navigate(`/products/category/${category}`)}
          sx={{
            borderColor: '#dcc5b2',
            color: '#5a4e46',
            fontWeight: '600',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#dcc5b2',
              borderColor: '#ccb5a2',
            },
          }}
        >
          See More
        </Button>
      </div>

      {/* --- Scrollable Product Area --- */}
      <div className="flex overflow-x-auto gap-6 py-4 px-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {productList.map((product) => (
          <div
            key={product._id}
            className="group relative inline-block flex-shrink-0 w-72 bg-[#faf7f3] rounded-xl border border-[#dcc5b2] shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="p-4 flex flex-col h-full">
              <Link to={`/products/${product._id}`} className="block">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.images}
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.discountPercentage > 0 && (
                     <span className="absolute top-2 left-2 bg-[#cb6d6a] text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {product.discountPercentage}% OFF
                     </span>
                  )}
                </div>
              </Link>
              
              <div className="mt-4 flex-grow">
                <Link to={`/products/${product._id}`} className="block">
                    <h3 className="text-lg font-bold text-[#5a4e46] truncate" title={product.title}>
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center mt-1">
                  {renderStars(product.rating)}
                  {product.reviewCount > 0 && (
                     <span className="text-xs text-[#857262] ml-2">({product.reviewCount} reviews)</span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-[#3d3327]">
                    ₹{product.price}
                  </p>
                  {product.originalPrice > product.price && (
                    <p className="text-md font-medium text-[#ac9887] line-through">
                        ₹{product.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#dcc5b2] flex items-center gap-3">
                <button className="flex-1 text-center bg-[#ccb5a2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#b8a18f] transition-colors duration-200">
                  Buy Now
                </button>
                <button className="bg-[#dfd0b8] border-2 border-[#ccb5a2] text-[#5a4e46] p-2 rounded-lg hover:bg-[#dcc5b2] transition-colors duration-200">
                  <ShoppingCartOutlinedIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;