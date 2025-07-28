import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import CropperDialog from "../Auth/CropperDialog";
import { Typography } from "@mui/material";
import { updateProfile, getUserProfileData, deleteAccount } from "../../actions/user";
import { CLEAR_ERROR } from '../../constants/actionTypes';
import ConfirmDelete from "../ConfirmDelete";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((state) => state.auth.authData);
  const { posts, products } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.auth);
  const userId = authData?.result?._id;

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", profilePhoto: "", bio: "",
    designerDetails: { brandName: "", portfolioUrl: "" },
    socialLinks: { instagram: "", facebook: "", twitter: "", website: "" },
    location: { city: "", state: "", country: "" },
  });

  const [cropSrc, setCropSrc] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (authData?.result) {
      const { result } = authData;
      setForm({
        name: result.name || "", email: result.email || "", profilePhoto: result.profilePhoto || "", bio: result.bio || "",
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

  if (!authData || !authData.result) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  const role = authData.result.role || "customer";
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
      setForm((prev) => ({ ...prev, designerDetails: { ...prev.designerDetails, [field]: value } }));
    } else if (name.startsWith("socialLinks.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }));
    } else if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateProfile(authData.result._id, form));
    setEditMode(false);
  };

  const roleBadge = {
    admin: "✔️ Admin",
    designer: "🧵 Designer",
    pending_designer: "⏳ Pending",
  };

  const locationParts = [form.location?.city, form.location?.state, form.location?.country].filter(Boolean);
  const fullLocation = locationParts.join(", ");

  const postsToShow = posts?.slice(0, 6);
  const productsToShow = products?.slice(0, 6);

  const cardStyle = "bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className={cardStyle}>
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

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-[#aa5a44] text-white py-2 px-4 rounded-lg hover:bg-[#8e4738] transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 px-4 rounded-lg hover:bg-[#f3e5dc] transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setShowDeletePopup(true)}
                className="flex-1 border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete Account
              </button>
            </div>

            <div className="space-y-4"> {/* Added space-y-4 here */}
              <div>
                <h3 className="text-md font-semibold text-[#44403c]">Bio:</h3>
                <p className="text-sm text-[#78716c]">{form.bio || "No bio yet."}</p>
              </div>

              {(role === "designer" || role === "pending_designer") && (
                <div>
                  <h3 className="text-md font-semibold text-[#44403c]">Designer Details:</h3>
                  <p className="text-sm text-[#78716c]">
                    <strong>Brand:</strong> {form.designerDetails.brandName || "—"}
                  </p>
                  <p className="text-sm text-[#78716c]">
                    <strong>Portfolio:</strong> {form.designerDetails.portfolioUrl || "—"}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-md font-semibold text-[#44403c]">Social Links:</h3>
                {Object.entries(form.socialLinks).map(([key, value]) => (
                  <p key={key} className="text-sm text-[#78716c]">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || "—"}
                  </p>
                ))}
              </div>

              <div>
                <h3 className="text-md font-semibold text-[#44403c]">Location:</h3>
                {fullLocation ? (
                  <p className="text-sm text-[#78716c]">
                    {fullLocation}
                  </p>
                ) : (
                  <p className="text-sm text-[#78716c]">No location specified.</p>
                )}
              </div>
            </div>

            <ConfirmDelete
              open={showDeletePopup}
              password={passwordInput}
              setPassword={setPasswordInput}
              requiresPassword={authData.result.authProvider !== "google"}
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
                  <Typography variant="body2" color="primary">
                    {form.profilePhoto ? "Change Photo" : "Upload Profile Photo"}
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
              <button type="submit" className="flex-1 bg-[#aa5a44] text-white py-2 rounded-lg hover:bg-[#8e4738] transition-colors">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc] transition-colors">Cancel</button>
            </div>
            {error && (
              <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
            )}
          </form>
        )}
      </div>

      {/* Posts Section */}
      <div className={cardStyle}>
        <h3 className="text-lg font-semibold text-[#44403c] mb-4">Your Posts</h3>
        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {postsToShow.map((post) => (
              <Link
                to={`/style-diaries/${post._id}`}
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
        ) : (
          <p className="text-sm text-[#78716c]">You have not created any posts yet.</p>
        )}
        {posts?.length > 4 && (
          <Link
            to={`/users/${userId}/posts`}
            className="mt-4 w-full text-center block text-[#aa5a44] border border-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]"
          >
            View All Posts ({posts.length})
          </Link>
        )}
      </div>

      {/* Products Section */}
      <div className={cardStyle}>
        <h3 className="text-lg font-semibold text-[#44403c] mb-4">Your Products</h3>
        {products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productsToShow.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-60 object-cover"
                  />
                )}
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
          <p className="text-sm text-[#78716c]">You have not created any products yet.</p>
        )}
        {products?.length > 4 && (
          <Link
            to={`/users/${userId}/products`}
            className="mt-4 w-full text-center block text-[#aa5a44] border border-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]"
          >
            View All Products ({products.length})
          </Link>
        )}
      </div>
    </div>
  );
}