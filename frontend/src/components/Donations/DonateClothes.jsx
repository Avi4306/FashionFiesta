import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, BuildingStorefrontIcon, LinkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Skeleton } from "@mui/material";
import { FaTimes } from "react-icons/fa"; // Added FaTimes for image removal

// --- Assuming you have an action for submitting donations ---
// Make sure you have:
// - submitDonation(data) to create a new donation
// - A relevant success/error state in your Redux store for this operation.
import { submitDonation } from "../../actions/donation";
import { CLEAR_DONATION_ERROR, SUBMIT_DONATION_SUCCESS_RESET } from "../../constants/actionTypes"; // Adjusted constant names for clarity

// --- Reusable & Styled Helper Components ---

const FormInputSkeleton = () => (
  <Skeleton variant="rectangular" width="100%" height={40} className="rounded-md" />
);

const DonateClothesSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-pulse">
    <div className="bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]">
      <Skeleton width="60%" height={32} className="mb-6" />
      <div className="space-y-4">
        <FormInputSkeleton />
        <FormInputSkeleton />
        <FormInputSkeleton />
        <Skeleton variant="rectangular" width="100%" height={120} className="rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInputSkeleton />
          <FormInputSkeleton />
        </div>
        <Skeleton variant="rectangular" width="100%" height={48} className="rounded-lg" />
      </div>
    </div>
  </div>
);

export default function DonateClothes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for the donation submission process
  const { loading, error, success } = useSelector((state) => state.donationSubmission); // Assuming a 'donation' slice for creating donations

  const [form, setForm] = useState({
    itemType: "",
    quantity: "",
    condition: "",
    description: "",
    pickupAddress: { street: "", city: "", state: "", zip: "" },
    contactNumber: "",
    preferredPickupDate: "",
    preferredPickupTime: "",
    photos: [], // For newly selected image files
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  // No need for submissionAttempted if we rely on Redux 'error' for validation messages

  // --- Handle Redux Success/Error for Submission ---
  useEffect(() => {
    if (success) {
      setSnackbarMessage("Donation request submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Reset form on success
      setForm({
        itemType: "",
        quantity: "",
        condition: "",
        description: "",
        pickupAddress: { street: "", city: "", state: "", zip: "" },
        contactNumber: "",
        preferredPickupDate: "",
        preferredPickupTime: "",
        photos: [],
      });
      // Optionally, navigate or clear success state
      // navigate("/thank-you-for-donating");
      dispatch({ type: SUBMIT_DONATION_SUCCESS_RESET }); // Clear success state to allow subsequent submissions
    }
    if (error) {
      setSnackbarMessage(error || "Failed to submit donation. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // No explicit dispatch for clearing error here, as the snackbar close will handle it
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("pickupAddress.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        pickupAddress: { ...prev.pickupAddress, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: files }));
  };

  const handleRemovePhoto = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.itemType || !form.quantity || !form.condition ||
        !form.pickupAddress.street || !form.pickupAddress.city ||
        !form.pickupAddress.state || !form.pickupAddress.zip ||
        !form.contactNumber) {
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
    }

    // Convert photos to Base64
    const photosBase64 = await Promise.all(
        form.photos.map(file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        }))
    );

    const donationData = {
      ...form,
      photos: photosBase64, // Send base64 strings to the backend
      quantity: Number(form.quantity), // Ensure quantity is a number
    };

    // Dispatch the submitDonation action
    dispatch(submitDonation(donationData));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    dispatch({ type: CLEAR_DONATION_ERROR }); // Clear Redux error state when snackbar closes
  };

  // Show skeleton loader only when the submission is actively loading
  if (loading) {
    return <DonateClothesSkeleton />;
  }

  const cardStyle = "bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#44403c] text-center mb-8">Donate Your Clothes</h2>
      <div className={cardStyle}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="itemType" className="block text-sm font-medium text-[#44403c]">
              Type of Item(s) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemType"
              name="itemType"
              value={form.itemType}
              onChange={handleChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
              placeholder="e.g., T-shirts, Jeans, Dresses"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-[#44403c]">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-[#44403c]">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                required
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44] bg-white"
              >
                <option value="">Select Condition</option>
                <option value="new_with_tags">New with Tags</option>
                <option value="like_new">Like New</option>
                <option value="gently_used">Gently Used</option>
                <option value="worn">Worn (but still usable)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#44403c]">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
              placeholder="Any additional details about the items (e.g., sizes, brands, minor flaws)"
            />
          </div>

          {/* Pickup Address Fields */}
          <fieldset className="space-y-4 border border-[#f0e4d3] p-4 rounded-md">
            <legend className="text-md font-semibold text-[#44403c] px-2">Pickup Address</legend>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-[#44403c] sr-only">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="pickupAddress.street"
                value={form.pickupAddress.street}
                onChange={handleChange}
                required
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                placeholder="Street Address"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#44403c] sr-only">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="pickupAddress.city"
                  value={form.pickupAddress.city}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-[#44403c] sr-only">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="pickupAddress.state"
                  value={form.pickupAddress.state}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                  placeholder="State"
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-[#44403c] sr-only">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="zip"
                  name="pickupAddress.zip"
                  value={form.pickupAddress.zip}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-[#44403c]">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
              placeholder="e.g., 123-456-7890"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preferredPickupDate" className="block text-sm font-medium text-[#44403c]">
                Preferred Pickup Date (Optional)
              </label>
              <input
                type="date"
                id="preferredPickupDate"
                name="preferredPickupDate"
                value={form.preferredPickupDate}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
              />
            </div>
            <div>
              <label htmlFor="preferredPickupTime" className="block text-sm font-medium text-[#44403c]">
                Preferred Pickup Time (Optional)
              </label>
              <input
                type="time"
                id="preferredPickupTime"
                name="preferredPickupTime"
                value={form.preferredPickupTime}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
              />
            </div>
          </div>

          {/* Photos section: Display new photos and allow new uploads */}
          <div>
            <label htmlFor="photos" className="block text-sm font-medium text-[#44403c]">
              Upload Photos (Optional)
            </label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full text-sm text-[#77736c] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0e4d3] file:text-[#aa5a44] hover:file:bg-[#e6d8c7]"
            />
            
            {/* Display newly selected photos for preview and removal */}
            {form.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.photos.map((file, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square rounded-md overflow-hidden shadow-sm">
                    <img src={URL.createObjectURL(file)} alt={`New Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove photo"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-1 text-xs text-[#78716c]">
              <PhotoIcon className="h-4 w-4 inline-block mr-1 text-gray-500" />
              Upload clear photos of the clothes to help us assess them.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#aa5a44] text-white py-3 rounded-lg hover:bg-[#8e4738] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Donation Request"
            )}
          </button>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}