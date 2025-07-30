import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsBySearch } from '../actions/products.js';
import ProductCard from './Products/Product/Product.jsx';
import { Typography, Container } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// --- Helper Components for Styling ---

const SkeletonCard = () => (
    <div className="bg-[#faf7f3] rounded-lg p-4 border border-[#f0e4d3] animate-pulse">
        <div className="bg-stone-300 rounded-md h-64 w-full"></div>
        <div className="mt-4">
            <div className="h-5 w-3/4 bg-stone-300 rounded"></div>
            <div className="h-4 w-1/2 bg-stone-200 rounded mt-2"></div>
        </div>
    </div>
);

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);

// --- Main Component (Styling Applied) ---

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const query = useQuery();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchQueryFromURL = query.get('searchQuery') || '';
    const pageFromURL = parseInt(query.get('page') || '1', 10);
    const [currentPage, setCurrentPage] = useState(pageFromURL);

    const {
        searchProducts,
        isLoading,
        searchCurrentPage,
        searchTotalPages,
        searchTotalProducts
    } = useSelector((state) => state.productsData);

    const productList = searchProducts || [];

    useEffect(() => {
        if (searchQueryFromURL) {
            dispatch(getProductsBySearch({
                search: searchQueryFromURL,
                page: currentPage,
                limit: 24
            }));
            navigate(`/products/search?searchQuery=${searchQueryFromURL}&page=${currentPage}&limit=9`);
        }
    }, [dispatch, searchQueryFromURL, currentPage, navigate]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (!searchQueryFromURL && !productList.length && !isLoading) {
        return (
            <div className="bg-white min-h-[60vh] flex items-center justify-center">
                <div className="text-center bg-[#faf7f3] border-2 border-dashed border-[#f0e4d3] rounded-lg p-12 max-w-lg mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-12 w-12 text-[#d6d3d1]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <h2 className="mt-4 text-xl font-bold text-[#44403c]">Find Your Next Favorite Piece</h2>
                    <p className="mt-2 text-sm text-[#78716c]">Use the search bar above to discover products from our talented designers.</p>
                </div>
            </div>
        );
    }

    if (!isLoading && productList.length === 0 && searchQueryFromURL) {
        return (
            <div className="bg-white min-h-[60vh] flex items-center justify-center">
                <div className="text-center bg-[#faf7f3] border-2 border-dashed border-[#f0e4d3] rounded-lg p-12 max-w-lg mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-12 w-12 text-[#d6d3d1]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <h2 className="mt-4 text-xl font-bold text-[#44403c]">No Products Found</h2>
                    <p className="mt-2 text-sm text-[#78716c]">
                        Your search for "<span className="font-semibold text-[#44403c]">{searchQueryFromURL}</span>" did not match any products. Please try a different term.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Container maxWidth="xl" className="py-10 px-4 sm:px-6 lg:px-8">
                {searchQueryFromURL && (
                    <Typography variant="h5" component="h1" className="font-bold text-[#44403c] mb-8">
                        Results for "{searchQueryFromURL}"
                        <span className="font-normal text-base text-[#78716c] ml-2">({searchTotalProducts} items)</span>
                    </Typography>
                )}

                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productList.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {searchTotalPages > 1 && (
                    <Stack spacing={2} className="mt-12 flex items-center justify-center">
                        <Pagination
                            count={searchTotalPages}
                            page={searchCurrentPage}
                            onChange={handlePageChange}
                            variant="outlined"
                            shape="rounded"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#44403c',
                                    borderColor: '#f0e4d3',
                                },
                                '& .MuiPaginationItem-root:hover': {
                                    backgroundColor: '#faf7f3',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#aa5a44 !important',
                                    color: '#ffffff',
                                    borderColor: '#aa5a44 !important',
                                },
                                '& .Mui-selected:hover': {
                                    backgroundColor: '#9a4f3d !important',
                                }
                            }}
                        />
                    </Stack>
                )}
            </Container>
        </div>
    );
};

export default SearchPage;