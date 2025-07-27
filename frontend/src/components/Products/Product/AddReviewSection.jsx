import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "../../../actions/products"; 
import { Link, useNavigate } from "react-router-dom";
import {
    Snackbar,
    Button,
    CircularProgress
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// UPDATED: Now accepts 'product' object instead of just 'productId'
const AddReviewSection = ({ product }) => { 
    const [comment, setComment] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // State for the dynamic snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authData } = useSelector((state) => state.auth);
    const user = authData?.result;

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            setSnackbar({
                open: true,
                message: "Please sign in to leave a review.",
                severity: "info",
            });
            return;
        }
        
        if (!comment || ratingValue === 0) {
            setSnackbar({
                open: true,
                message: "Please fill in both a comment and a rating.",
                severity: "warning",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Pass product._id to the addReview action
            await dispatch(addReview(product._id, { comment, rating: ratingValue })); 
            
            // On success
            setSnackbar({
                open: true,
                message: "Review submitted successfully!",
                severity: "success",
            });

            // Reset form
            setComment("");
            setRatingValue(0);
        } catch (error) {
            console.error("Failed to submit review:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            
            // On error
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-10 border-t pt-6">
            {/* NEW SECTION: Display existing reviews */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                    {product.reviews.map((review, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                            <Link to = {`/user/${review.user}`}>
                            <img
                                src={review.profilePhoto || `https://placehold.co/48x48/F0E4D3/44403c?text=${review.name?.charAt(0) || 'A'}`} 
                                alt={review.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                            </Link>
                            <div>
                                <p className="font-semibold text-gray-800">{review.name}</p>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mb-8">No reviews yet. Be the first to leave one!</p>
            )}

            {/* Existing "Leave a Review" form */}
            <h3 className="text-lg font-semibold mb-2 text-[#aa5a44]">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
                <textarea
                    className="w-full border rounded p-2 focus:ring-[#aa5a44] focus:border-[#aa5a44] outline-none transition-colors"
                    rows="3"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-3 items-center">
                    <select
                        className="border p-1 rounded focus:ring-[#aa5a44] focus:border-[#aa5a44] outline-none"
                        value={ratingValue}
                        onChange={(e) => setRatingValue(Number(e.target.value))}
                    >
                        <option value="0">Rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-[#aa5a44] text-white px-4 py-2 rounded hover:bg-[#8e4738] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors relative"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </form>

            {/* Dynamic Snackbar for all messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div className="flex-grow">{snackbar.message}</div>
                    {snackbar.severity === 'info' && (
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                                handleSnackbarClose();
                                navigate('/auth');
                            }}
                        >
                            SIGN IN
                        </Button>
                    )}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddReviewSection;