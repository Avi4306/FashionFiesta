import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CropperDialog from '../Auth/CropperDialog';
import { Typography, Button } from "@mui/material";
import { updateProfile } from "../../actions/user";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.authData);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.result?.name || "",
    email: user?.result?.email || "",
    profilePhoto: user?.result?.profilePhoto || "",
    bio: user?.result?.bio || "",
    designerDetails: {
      brandName: user?.result?.designerDetails?.brandName || "",
      portfolioUrl: user?.result?.designerDetails?.portfolioUrl || "",
    },
  });

  const [imagePreview, setImagePreview] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);

  const role = user?.result?.role || "customer";
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
                  <strong>Portfolio:</strong>{" "}
                  {form.designerDetails.portfolioUrl ? (
                    <a
                      href={form.designerDetails.portfolioUrl}
                      className="text-[#aa5a44] underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
                {user?.result?.designerDetails?.appliedAt && (
                  <p className="text-sm text-[#78716c]">
                    <strong>Applied:</strong>{" "}
                    {new Date(user.result.designerDetails.appliedAt).toLocaleDateString()}
                  </p>
                )}
                {user?.result?.designerDetails?.verified && (
                  <p className="text-sm text-green-600 font-medium">✔️ Verified</p>
                )}
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
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="profile-upload"
                />
                <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: 80, height: 80, borderRadius: '50%' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        margin: '0 auto',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}
                    >
                      {form.name ? form.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <Typography variant="body2" color="primary">
                    {imagePreview ? 'Change Photo' : 'Upload Profile Photo'}
                  </Typography>
                </label>
                {imagePreview && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      setImagePreview('');
                      setForm({ ...form, profilePhoto: '' });
                    }}
                    style={{ marginTop: '0.5rem' }}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#44403c]">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#44403c]">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#44403c]">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                rows={3}
              />
            </div>

            {(role === "designer" || role === "pending_designer") && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-[#44403c]">Brand Name</label>
                  <input
                    type="text"
                    name="designerDetails.brandName"
                    value={form.designerDetails.brandName}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[#44403c]">Portfolio URL</label>
                  <input
                    type="text"
                    name="designerDetails.portfolioUrl"
                    value={form.designerDetails.portfolioUrl}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-[#aa5a44] text-white py-2 rounded-lg hover:bg-[#8e4738]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 border border-[#aa5a44] text-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
