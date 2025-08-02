import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import CropperDialog from "../Auth/CropperDialog";
import { Snackbar, Alert, Skeleton } from "@mui/material";
import {
  updateProfile,
  getUserProfileData,
  deleteAccount,
} from "../../actions/user";
import { CLEAR_ERROR } from "../../constants/actionTypes";
import ConfirmDelete from "../ConfirmDelete";
import {
  MapPinIcon,
  BuildingStorefrontIcon,
  LinkIcon,
  UserCircleIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  PhotoIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

/**
 * A reusable skeleton component for the posts and products cards in the profile view.
 */
const ProfileCardSkeleton = () => (
  <div className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm overflow-hidden block animate-pulse">
    <Skeleton variant="rectangular" width="100%" height={160} />
    <div className="p-4">
      <Skeleton width="80%" height={20} className="mb-2" />
      <Skeleton width="100%" height={16} />
      <Skeleton width="60%" height={16} className="mt-1" />
    </div>
  </div>
);

/**
 * The main skeleton loader for the entire Profile page.
 * It mimics the structure of the `Profile` component.
 */
const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-pulse lg:grid lg:grid-cols-12 lg:gap-8">
    {/* Left Column Skeleton */}
    <div className="lg:col-span-4">
      <div className="bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]">
        <div className="flex flex-col items-center">
          <Skeleton variant="circular" width={80} height={80} />
          <div className="w-40 h-6 bg-stone-300 rounded mt-4" />
          <div className="w-48 h-4 bg-stone-200 rounded mt-2" />
        </div>
        <div className="space-y-6 mt-6 border-t border-[#f0e4d3] pt-6">
          <div className="h-12 w-full bg-stone-200 rounded"></div>
          <div className="h-12 w-full bg-stone-200 rounded"></div>
          <div className="h-12 w-2/3 bg-stone-200 rounded"></div>
        </div>
      </div>
    </div>
    {/* Right Column Skeleton */}
    <div className="lg:col-span-8 mt-8 lg:mt-0 space-y-8">
      <div className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton width="30%" height={24} />
          <Skeleton width="20%" height={32} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
      </div>
      <div className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton width="30%" height={24} />
          <Skeleton width="20%" height={32} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
      </div>
    </div>
  </div>
);

/**
 * The main Profile component.
 */
export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((state) => state.auth.authData);
  const { posts, products, isLoading: userPostsProductsLoading } = useSelector(
    (state) => state.user
  );
  const { error, isLoading: authLoading } = useSelector((state) => state.auth); // Error and loading from auth reducer
  const userId = authData?.result?._id;

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    profilePhoto: "",
    bio: "",
    role: "",
    designerDetails: { brandName: "", portfolioUrl: "" },
    socialLinks: { instagram: "", facebook: "", twitter: "", website: "" },
    location: { city: "", state: "", country: "" },
  });

  const [cropSrc, setCropSrc] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // State for Snackbar notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  useEffect(() => {
    if (authData?.result) {
      const { result } = authData;
      setForm({
        name: result.name || "",
        email: result.email || "",
        profilePhoto: result.profilePhoto || "",
        bio: result.bio || "",
        role: result.role || "customer",
        designerDetails: {
          brandName: result.designerDetails?.brandName || "",
          portfolioUrl: result.designerDetails?.portfolioUrl || "",
        },
        socialLinks: {
          instagram: result.socialLinks?.instagram || "",
          facebook: result.socialLinks?.facebook || "",
          twitter: result.socialLinks?.twitter || "",
          website: result.socialLinks?.website || "",
        },
        location: {
          city: result.location?.city || "",
          state: result.location?.state || "",
          country: result.location?.country || "",
        },
      });
    }
  }, [authData]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfileData(userId));
    }
  }, [dispatch, userId]);

  // Clear error state when edit mode changes, or on component mount
  useEffect(() => {
    dispatch({ type: CLEAR_ERROR });
  }, [editMode, dispatch]);

  // Effect to handle Snackbar messages based on Redux state after a submission attempt
  useEffect(() => {
    if (submissionAttempted && !authLoading) {
      if (error) {
        setSnackbarMessage(error);
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setEditMode(false); // Only exit edit mode on successful save
      }
      setSnackbarOpen(true);
      setSubmissionAttempted(false); // Reset the flag
    }
  }, [submissionAttempted, authLoading, error]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (authLoading || userPostsProductsLoading || !authData || !authData.result) {
    return <ProfileSkeleton />;
  }

  const role = authData.result.role || "customer";
  const avatarPlaceholder = `https://placehold.co/80x80/F0E4D3/44403c?text=${
    form.name.charAt(0) || "U"
  }`;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("profile");
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropSrc(reader.result);
      setOpenCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("designerDetails.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        designerDetails: { ...prev.designerDetails, [field]: value },
      }));
    } else if (name.startsWith("socialLinks.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
    } else if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionAttempted(true);
    dispatch(updateProfile(authData.result._id, form));
  };

  const handleApplyAsDesigner = () => {
    navigate("/apply-designer");
  };

  const roleBadge = {
    admin: "✔️ Admin",
    designer: "🧵 Designer",
    pending_designer: "⏳ Pending",
    customer: "",
  };

  const postsToShow = posts?.slice(0, 4);
  const productsToShow = products?.slice(0, 4);

  const cardStyle =
    "bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]";

  // Helper component for rendering info items
  const InfoItem = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 text-[#77736c]">{icon}</div>
      <div className="flex-grow">
        <dt className="text-sm font-medium text-[#44403c]">{label}</dt>
        <dd className="mt-1 text-sm text-[#77736c] break-words">
          {children || "N/A"}
        </dd>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* --- Left Column (User Info & Form) --- */}
      <aside className="lg:col-span-4 lg:sticky lg:top-8 self-start">
        <div className={cardStyle}>
          {!editMode ? (
            <>
              {/* Profile View */}
              <div className="flex flex-col items-center text-center pb-6">
                <img
                  src={form.profilePhoto || avatarPlaceholder}
                  alt={form.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
                />
                <h2 className="text-2xl font-bold text-[#44403c] mt-4 flex items-center gap-2">
                  {form.name || "No Name"}
                  {role !== "customer" && (
                    <span className="text-sm bg-[#f0e4d3] text-[#aa5a44] px-2 py-1 rounded-full font-medium">
                      {roleBadge[role]}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-[#78716c]">{form.email}</p>
              </div>

              <div className="space-y-4 border-t border-[#f0e4d3] pt-6">
                <InfoItem icon={<UserCircleIcon />} label="Bio">
                  {form.bio || "No bio provided."}
                </InfoItem>

                {role !== "customer" && (
                  <>
                    <InfoItem icon={<BriefcaseIcon />} label="Brand">
                      {form.designerDetails?.brandName || "N/A"}
                    </InfoItem>
                    <InfoItem icon={<LinkIcon />} label="Portfolio">
                      {form.designerDetails?.portfolioUrl ? (
                        <a
                          href={form.designerDetails.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#aa5a44] hover:underline font-medium"
                        >
                          View Portfolio
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </InfoItem>
                  </>
                )}
                <InfoItem icon={<MapPinIcon />} label="Location">
                  {[
                    form.location?.city,
                    form.location?.state,
                    form.location?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </InfoItem>
                <InfoItem icon={<GlobeAltIcon />} label="Social Links">
                  <div className="space-y-1">
                    {Object.entries(form.socialLinks).map(([key, value]) => (
                      <p key={key} className="text-sm text-[#78716c]">
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                        {value || "N/A"}
                      </p>
                    ))}
                  </div>
                </InfoItem>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-[#ccb5a2] text-white py-2 px-4 rounded-lg hover:bg-[#dcc5b2] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <PencilSquareIcon className="w-5 h-5" /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 px-4 rounded-lg hover:bg-[#f3e5dc] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
                </button>
              </div>
              <button
                onClick={() => setShowDeletePopup(true)}
                className="mt-2 w-full border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <TrashIcon className="w-5 h-5" /> Delete Account
              </button>
              {role === "customer" && (
                <button
                  onClick={handleApplyAsDesigner}
                  className="mt-2 w-full bg-[#5cb85c] text-white py-2 px-4 rounded-lg hover:bg-[#4cae4c] transition-colors text-sm font-medium"
                >
                  Apply to be a Designer
                </button>
              )}
            </>
          ) : (
            <>
              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  {openCropper && (
                    <CropperDialog
                      imageSrc={cropSrc}
                      onClose={() => setOpenCropper(false)}
                      onCropDone={(croppedImage) => {
                        setForm({ ...form, profilePhoto: croppedImage });
                        setOpenCropper(false);
                      }}
                    />
                  )}
                  <div className="text-center mb-4">
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="cursor-pointer block">
                      {form.profilePhoto ? (
                        <img
                          src={form.profilePhoto}
                          alt="Preview"
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white mx-auto">
                          {form.name ? form.name.charAt(0) : "U"}
                        </div>
                      )}
                      <p className="text-[#aa5a44] text-sm mt-2">
                        {form.profilePhoto ? "Change Photo" : "Upload Profile Photo"}
                      </p>
                    </label>
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-[#44403c]">Your Role:</span>
                  <input
                    name="role"
                    value={roleBadge[form.role] || form.role || "customer"}
                    readOnly
                    className="mt-1 w-full border px-3 py-2 rounded-md bg-gray-100 text-[#78716c] cursor-not-allowed"
                    placeholder="Role"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#44403c]">Name:</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                    placeholder="Name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-[#44403c]">Bio:</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                    placeholder="Bio"
                  />
                </label>

                {role !== "customer" && (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium text-[#44403c]">Brand Name:</span>
                      <input
                        name="designerDetails.brandName"
                        value={form.designerDetails.brandName}
                        onChange={handleChange}
                        className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                        placeholder="Brand Name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-[#44403c]">Portfolio URL:</span>
                      <input
                        name="designerDetails.portfolioUrl"
                        value={form.designerDetails.portfolioUrl}
                        onChange={handleChange}
                        className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                        placeholder="Portfolio URL"
                      />
                    </label>
                  </>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-[#44403c]">Location</h3>
                  {Object.keys(form.location).map((key) => (
                    <label key={key} className="block">
                      <span className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <input
                        name={`location.${key}`}
                        value={form.location[key]}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-[#44403c]">Social Links</h3>
                  {Object.keys(form.socialLinks).map((key) => (
                    <label key={key} className="block">
                      <span className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <input
                        name={`socialLinks.${key}`}
                        value={form.socialLinks[key]}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa5a44]"
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#aa5a44] text-white py-2 rounded-lg hover:bg-[#8e4738] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </aside>

      {/* --- Right Column (Posts & Products) --- */}
      <div className="lg:col-span-8 mt-8 lg:mt-0 space-y-8">
        {/* Posts Section */}
        <section className={cardStyle}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#44403c]">Your Posts</h3>
            {posts?.length > 4 && (
              <Link
                to={`/user/${userId}/posts`}
                className="text-sm text-[#aa5a44] border border-[#aa5a44] px-3 py-1 rounded-lg hover:bg-[#f3e5dc] transition-colors"
              >
                See All Posts ({posts.length})
              </Link>
            )}
          </div>
          {postsToShow?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {postsToShow.map((post) => (
                <Link
                  to={`/style-diaries/${post._id}`}
                  key={post._id}
                  className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-[#44403c]">{post.title}</h4>
                    <p className="text-sm text-[#78716c] line-clamp-2">
                      {post.content || "No content"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#78716c] flex items-center gap-2">
              <PhotoIcon className="h-5 w-5 text-gray-500" />
              You have not created any posts yet.
            </p>
          )}
        </section>

        {/* Products Section */}
        <section className={cardStyle}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#44403c]">Your Products</h3>
            {products?.length > 4 && (
              <Link
                to={`/user/${userId}/products`}
                className="text-sm text-[#aa5a44] border border-[#aa5a44] px-3 py-1 rounded-lg hover:bg-[#f3e5dc] transition-colors"
              >
                See All Products ({products.length})
              </Link>
            )}
          </div>
          {productsToShow?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productsToShow.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-[#44403c]">{product.title}</h4>
                    <p className="text-sm text-[#78716c] line-clamp-2">
                      {product.description || "No description"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#78716c] flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5 text-gray-500" />
              You have not created any products yet.
            </p>
          )}
        </section>
      </div>

      {/* Snackbar for notifications */}
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

      {/* Confirm Delete Popup */}
      <ConfirmDelete
        open={showDeletePopup}
        password={passwordInput}
        setPassword={setPasswordInput}
        requiresPassword={authData?.result?.authProvider !== "google"}
        onClose={() => {
          setShowDeletePopup(false);
          setPasswordInput("");
        }}
        onConfirm={() => {
          dispatch({ type: CLEAR_ERROR });
          dispatch(deleteAccount(userId, passwordInput, navigate));
          setShowDeletePopup(false);
          setPasswordInput("");
        }}
      />
    </main>
  );
}