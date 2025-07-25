import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ProductCarousel = ({ category, products }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-xl font-bold">{category}</h2>
        <Button variant="outline" onClick={() => navigate(`/products/category/${category}`)}>
          See More
        </Button>
      </div>
      <div className="overflow-x-auto whitespace-nowrap px-4 py-2">
        {products.products.map((product) => (
            <div
            key={product._id}
            className="inline-block w-64 mr-4 rounded-lg shadow bg-white p-4"
          >
            <Link to = {`/products/${product._id}`}>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
            <p className="text-gray-500">${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;