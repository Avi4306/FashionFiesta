import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CropperDialog from "../Auth/CropperDialog";
import { Typography, Button } from "@mui/material";
import { updateProfile } from "../../actions/user";
import { useEffect } from "react";
import { getUserProfileData } from "../../actions/user";
import { Link } from "react-router-dom";
import ConfirmDelete from "../ConfirmDelete"; // adjust path
import { deleteAccount } from "../../actions/user";
import { CLEAR_ERROR } from '../../constants/actionTypes';


export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.authData);
  const { posts, products } = useSelector((state) => state.user);
  const userId = user?.result?._id;
  useEffect(() => {
    if (userId) {
      dispatch(getUserProfileData(userId)); // should fetch posts + products for the logged-in user
    }
  }, [dispatch, userId]);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const role = user.result.role || "customer";
  
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user.result.name || "",
    email: user.result.email || "",
    profilePhoto: user.result.profilePhoto || "",
    bio: user.result.bio || "",
    designerDetails: {
      brandName: user.result.designerDetails?.brandName || "",
      portfolioUrl: user.result.designerDetails?.portfolioUrl || "",
    },
    socialLinks: {
      instagram: user.result.socialLinks?.instagram || "",
      facebook: user.result.socialLinks?.facebook || "",
      twitter: user.result.socialLinks?.twitter || "",
      website: user.result.socialLinks?.website || "",
    },
    location: {
      city: user.result.location?.city || "",
      state: user.result.location?.state || "",
      country: user.result.location?.country || "",
    },
  });
  
  const [imagePreview, setImagePreview] = useState("");
  const [cropSrc, setCropSrc] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);
  const { error } = useSelector((state) => state.auth);
  
  const avatarPlaceholder = `https://placehold.co/80x80/F0E4D3/44403c?text=${form.name.charAt(0) || "U"}`;
  
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
    dispatch(updateProfile(user.result._id, form));
    setEditMode(false);
  };
  
  const roleBadge = {
    admin: "✔️ Admin",
    designer: "🧵 Designer",
    pending_designer: "⏳ Pending",
  };
  const locationParts = [
    user.socialLinks?.location?.city,
    user.socialLinks?.location?.state,
    user.socialLinks?.location?.country,
  ].filter(Boolean); // removes falsy values (e.g., "", null)
  
  if (!user || !user.result) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }
  const fullLocation = locationParts.join(", ");
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]">
        {!editMode ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={form.profilePhoto || avatarPlaceholder}
                alt={form.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-[#44403c] flex items-center gap-2">
                  {form.name}
                  {role !== "customer" && (
                    <span className="text-sm bg-[#f0e4d3] text-[#aa5a44] px-2 py-1 rounded-full">
                      {roleBadge[role]}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-[#78716c]">{form.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold text-[#44403c] mb-1">Bio:</h3>
              <p className="text-sm text-[#78716c]">{form.bio || "No bio yet."}</p>
            </div>

            {(role === "designer" || role === "pending_designer") && (
              <div className="mb-4">
                <h3 className="text-md font-semibold text-[#44403c] mb-1">Designer Details:</h3>
                <p className="text-sm text-[#78716c]">
                  <strong>Brand:</strong> {form.designerDetails.brandName || "—"}
                </p>
                <p className="text-sm text-[#78716c]">
                  <strong>Portfolio:</strong> {form.designerDetails.portfolioUrl || "—"}
                </p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-md font-semibold text-[#44403c] mb-1">Social Links:</h3>
              {Object.entries(form.socialLinks).map(([key, value]) => (
                <p key={key} className="text-sm text-[#78716c]">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || "—"}
                </p>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold text-[#44403c] mb-1">Location:</h3>
                {fullLocation && (
                  <p className="text-sm text-[#78716c]">
                    <strong>Location:</strong> {fullLocation}
                  </p>
                )}
            </div>
            {posts?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-[#44403c] mb-4">Your Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <Link to = {`/style-diaries/${post._id}`}
                      key={post._id}
                      className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
                    >
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-[#44403c]">{post.title}</h4>
                        <p className="text-sm text-[#78716c] line-clamp-2">
                          {post.content || "No content"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {products?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-[#44403c] mb-4">Your Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Link to = {`/products/${product._id}`}
                      key={product._id}
                      className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-[#44403c]">{product.name}</h4>
                        <p className="text-sm text-[#78716c] line-clamp-2">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-[#aa5a44] text-white py-2 px-4 rounded-lg hover:bg-[#8e4738]"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
            {error && (
              <div className="text-red-600 text-sm mb-2 text-center">{error}</div>
            )}
            <ConfirmDelete
              open={showDeletePopup}
              password={passwordInput}
              setPassword={setPasswordInput}
              requiresPassword={user.result.authProvider !== "google"}
              onClose={() => {
                setShowDeletePopup(false);
                setPasswordInput("");
              }}
              onConfirm={() => {    dispatch({ type: CLEAR_ERROR });
                dispatch(deleteAccount(userId, passwordInput, navigate));
                setShowDeletePopup(false);
                setPasswordInput("");
              }}
            />
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {openCropper && (
                <CropperDialog
                  imageSrc={cropSrc}
                  onClose={() => setOpenCropper(false)}
                  onCropDone={(croppedImage) => {
                    setForm({ ...form, profilePhoto: croppedImage });
                    setImagePreview(croppedImage);
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
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white mx-auto">
                      {form.name ? form.name.charAt(0) : "U"}
                    </div>
                  )}
                  <Typography variant="body2" color="primary">
                    {imagePreview ? "Change Photo" : "Upload Profile Photo"}
                  </Typography>
                </label>
              </div>
            </div>

            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" placeholder="Name" />
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full border px-3 py-2 rounded-md" placeholder="Bio" />

            {(role === "designer" || role === "pending_designer") && (
              <>
                <input name="designerDetails.brandName" value={form.designerDetails.brandName} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" placeholder="Brand Name" />
                <input name="designerDetails.portfolioUrl" value={form.designerDetails.portfolioUrl} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" placeholder="Portfolio URL" />
              </>
            )}

            {Object.keys(form.socialLinks).map((key) => (
              <input
                key={key}
                name={`socialLinks.${key}`}
                value={form.socialLinks[key]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}

            {Object.keys(form.location).map((key) => (
              <input
                key={key}
                name={`location.${key}`}
                value={form.location[key]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}

            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-[#aa5a44] text-white py-2 rounded-lg hover:bg-[#8e4738]">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
