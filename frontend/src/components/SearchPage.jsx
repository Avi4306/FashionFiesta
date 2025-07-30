import React, { useEffect, useState } from 'react'; // 🆕 Import useState
import { useLocation, useNavigate } from 'react-router-dom'; // 🆕 Import useNavigate for URL updates
import { useDispatch, useSelector } from 'react-redux';
import { getProductsBySearch } from '../actions/products.js';
import ProductCard from './Products/Product/Product.jsx';
import { Typography, CircularProgress, Container } from '@mui/material';
import Pagination from '@mui/material/Pagination'; // 🆕 Import Pagination
import Stack from '@mui/material/Stack'; // 🆕 Import Stack for pagination layout

// A simple hook to get URL search parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const query = useQuery();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 🆕 Initialize useNavigate

    // Get search query from URL, default to empty string if not present
    const searchQueryFromURL = query.get('searchQuery') || '';
    // Get page from URL, default to 1
    const pageFromURL = parseInt(query.get('page') || '1', 10);

    // 🆕 State for current page, initialized from URL
    const [currentPage, setCurrentPage] = useState(pageFromURL);

    // Destructure search products and pagination data from Redux store
    const {
        searchProducts,
        isLoading,
        searchCurrentPage, // The current page returned by the backend
        searchTotalPages,  // The total pages returned by the backend
        searchTotalProducts // The total products returned by the backend
    } = useSelector((state) => state.productsData);
    console.log(searchProducts)

    // The actual list of products for the current page
    const productList = searchProducts || []; // Now searchProducts directly holds the array

    // Dispatch the search action whenever the searchQuery or currentPage changes
    useEffect(() => {
        // Only dispatch if there's a valid search query
        if (searchQueryFromURL) {
            dispatch(getProductsBySearch({
                search: searchQueryFromURL,
                page: currentPage,
                limit: 9 // Make sure this matches your backend's default or chosen limit
            }));
            // Update the URL to reflect the current page
            navigate(`/products/search?searchQuery=${searchQueryFromURL}&page=${currentPage}&limit=9`);
        } else {
            // If searchQuery is cleared (e.g., from NavBar) and you land on this page,
            // you might want to clear previous results or show a default message.
            // You could dispatch an action to clear searchProducts state here if needed.
        }
    }, [dispatch, searchQueryFromURL, currentPage, navigate]); // Added navigate to dependency array

    // Handler for page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update local state, which triggers useEffect
        // useEffect will then handle dispatching the action and updating the URL
    };

    // Handle the case where there is no search query initially
    if (!searchQueryFromURL && !productList.length && !isLoading) {
        return (
            <div className="text-center p-10">
                <h2 className="text-xl font-semibold text-text-primary">Search for a product</h2>
                <p className="text-text-secondary">Type something into the search bar to find products.</p>
            </div>
        );
    }

    // Handle case while loading
    if (isLoading && productList.length === 0) { // Only show loader if no products are currently loaded
        return (
            <div className="flex justify-center items-center h-48">
                <CircularProgress color="primary" />
            </div>
        );
    }

    // Handle case where no products are found after a search
    if (!isLoading && productList.length === 0 && searchQueryFromURL) {
        return (
            <div className="text-center p-10">
                <h2 className="text-xl font-semibold text-text-primary">No products found for "{searchQueryFromURL}"</h2>
                <p className="text-text-secondary">Try searching for something else.</p>
            </div>
        );
    }

    return (
        <Container maxWidth="xl" className="p-4 md:p-8">
            <Typography variant="h5" className="font-bold text-text-primary mb-6">
                Results for "{searchQueryFromURL}" ({searchTotalProducts} items)
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
                {productList.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            {searchTotalPages > 1 && ( // Only show pagination if there's more than one page
                <Stack spacing={2} className="mt-8 flex justify-center">
                    <Pagination
                        count={searchTotalPages}
                        page={searchCurrentPage} // Use the current page from Redux state
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        size="large"
                    />
                </Stack>
            )}
        </Container>
    );
};

export default SearchPage;