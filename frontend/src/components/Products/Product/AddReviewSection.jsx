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
import StarIcon from '@mui/icons-material/Star'; // Import the StarIcon

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddReviewSection = ({ product }) => { 
    const [comment, setComment] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(0); // State for star hover effect
    const [isLoading, setIsLoading] = useState(false);

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
            await dispatch(addReview(product._id, { comment, rating: ratingValue })); 
            
            setSnackbar({
                open: true,
                message: "Review submitted successfully!",
                severity: "success",
            });

            setComment("");
            setRatingValue(0);
        } catch (error) {
            console.error("Failed to submit review:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to render star ratings within the review cards
    const renderReviewStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
          stars.push(
            <span key={i} className={i < rating ? "text-[#c39a73]" : "text-[#dcc5b2]"}>
              &#9733;
            </span>
          );
        }
        return stars;
    };

    return (
        <div>
            {/* Display existing reviews */}
            <h3 className="text-xl font-bold mb-4 text-[#5a4e46]">Customer Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                    {product.reviews.map((review, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border border-[#dcc5b2] rounded-lg bg-[#faf7f3]">
                            <Link to={`/user/${review.user}`}>
                                <img
                                    src={review.profilePhoto || `https://placehold.co/48x48/dfd0b8/5a4e46?text=${review.name?.charAt(0) || 'A'}`} 
                                    alt={review.name}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                            </Link>
                            <div>
                                <p className="font-semibold text-[#5a4e46]">{review.name}</p>
                                <div className="flex items-center my-1">
                                    {renderReviewStars(review.rating)}
                                </div>
                                <p className="text-[#857262]">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-[#857262] mb-8">No reviews yet. Be the first to leave one!</p>
            )}

            {/* "Leave a Review" form */}
            <h3 className="text-xl font-bold mb-4 text-[#5a4e46]">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
                <textarea
                    className="w-full border border-[#dcc5b2] bg-white rounded-md p-3 focus:ring-2 focus:ring-[#ccb5a2] focus:border-[#ccb5a2] outline-none transition-colors text-[#5a4e46] placeholder:text-[#ac9887]"
                    rows="3"
                    placeholder="Share your thoughts on the product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* NEW: Interactive Star Rating Input */}
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(0)}>
                        {[...Array(5)].map((_, index) => {
                            const currentRating = index + 1;
                            return (
                                <StarIcon
                                    key={index}
                                    className="cursor-pointer transition-colors"
                                    sx={{
                                        color: currentRating <= (hoverValue || ratingValue) ? '#c39a73' : '#dcc5b2',
                                        fontSize: '2rem'
                                    }}
                                    onClick={() => setRatingValue(currentRating)}
                                    onMouseEnter={() => setHoverValue(currentRating)}
                                />
                            );
                        })}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#ccb5a2] text-white px-6 py-2.5 rounded-md font-semibold hover:bg-[#b8a18f] disabled:bg-[#dcc5b2] disabled:cursor-not-allowed transition-colors relative flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Submit Review"
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