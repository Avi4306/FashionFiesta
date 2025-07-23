import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addReview } from "../../actions/products";

const AddReviewSection = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    if (!comment || ratingValue === 0) return alert("Fill in all fields.");
    
    dispatch(addReview(productId, { comment, rating: ratingValue }));
    setComment("");
    setRatingValue(0);
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-lg font-semibold mb-2 text-[#aa5a44]">Leave a Review</h3>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <textarea
          className="w-full border rounded p-2"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex gap-3 items-center">
          <select
            className="border p-1 rounded"
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
            className="bg-[#aa5a44] text-white px-4 py-2 rounded hover:bg-[#8e4738]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewSection;