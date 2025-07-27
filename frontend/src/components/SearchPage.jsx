import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsBySearch } from '../actions/products.js';
import ProductCard from './Products/Product/Product.jsx';
import { Typography, CircularProgress, Container } from '@mui/material';

// A simple hook to get URL search parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const query = useQuery();
    const dispatch = useDispatch();
    const searchQuery = query.get('searchQuery');
    
    // The selector now assumes your products reducer has the search results and loading state
    const { products, isLoading } = useSelector((state) => state.productsData);
    console.log(products)
    const productList = products?.data || [];

    // Dispatch the search action whenever the searchQuery in the URL changes
    useEffect(() => {
        if (searchQuery) {
            dispatch(getProductsBySearch({ search: searchQuery }));
        }
    }, [dispatch, searchQuery]);

    // Handle the case where there is no search query or results
    if (!searchQuery && !productList.length) {
        return (
            <div className="text-center p-10">
                <h2 className="text-xl font-semibold text-text-primary">Search for a product</h2>
                <p className="text-text-secondary">Type something into the search bar to find products.</p>
            </div>
        );
    }

    return (
        <Container maxWidth="xl" className="p-4 md:p-8">
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <>
                    <Typography variant="h5" className="font-bold text-text-primary mb-6">
                        Results for "{searchQuery}"
                    </Typography>
                    {productList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
                            {productList.map((product) => (
                                <ProductCard key={product._id} product={product} /> // Using 'Products' as a placeholder
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10">
                            <h2 className="text-xl font-semibold text-text-primary">No products found</h2>
                            <p className="text-text-secondary">Try searching for something else.</p>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default SearchPage;