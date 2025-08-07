import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  Skeleton
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { PhotoIcon } from "@heroicons/react/24/solid";

import { submitDonation } from "../../actions/donation";
import {
  CLEAR_DONATION_ERROR,
  SUBMIT_DONATION_SUCCESS_RESET
} from "../../constants/actionTypes";

// Skeleton Components
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

  const { loading, error, success } = useSelector((state) => state.donationSubmission);
  const user = useSelector((state) => state.auth?.user); // 👈 Check auth state

  const [form, setForm] = useState({
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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (success) {
      setSnackbarMessage("Donation request submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

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

      dispatch({ type: SUBMIT_DONATION_SUCCESS_RESET });
    }

    if (error) {
      setSnackbarMessage(error || "Failed to submit donation. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

    // 🔒 Prevent unauthenticated submission
    if (!user) {
      setSnackbarMessage("Please log in to submit a donation.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (
      !form.itemType ||
      !form.quantity ||
      !form.condition ||
      !form.pickupAddress.street ||
      !form.pickupAddress.city ||
      !form.pickupAddress.state ||
      !form.pickupAddress.zip ||
      !form.contactNumber
    ) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const photosBase64 = await Promise.all(
      form.photos.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          })
      )
    );

    const donationData = {
      ...form,
      photos: photosBase64,
      quantity: Number(form.quantity),
    };

    dispatch(submitDonation(donationData));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    dispatch({ type: CLEAR_DONATION_ERROR });
  };

  if (loading) {
    return <DonateClothesSkeleton />;
  }

  const cardStyle =
    "bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#44403c] text-center mb-8">
        Donate Your Clothes
      </h2>
      <div className={cardStyle}>
        {!user ? (
          <div className="text-center text-red-500 font-medium my-4">
            Please{" "}
            <button
              onClick={() => navigate("/auth")}
              className="underline text-[#aa5a44]"
            >
              log in
            </button>{" "}
            to submit a donation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields... same as before */}
            {/* ...[Insert the rest of your inputs here from itemType, quantity, address, photos, etc.] */}
            
            {/* Photos Preview and Removal */}
            {form.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.photos.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group aspect-square rounded-md overflow-hidden shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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

            {/* Submit Button */}
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
        )}
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