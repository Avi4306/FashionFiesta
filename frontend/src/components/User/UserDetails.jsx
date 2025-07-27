import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileData } from "../../actions/user"; // should dispatch user, posts, products
import { useNavigate } from "react-router-dom";

const roleBadge = {
  designer: "Designer",
  pending_designer: "Pending Approval",
  admin: "Admin",
};

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.authData)
  const { isLoading, user, posts, products } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect to private profile if viewing your own profile
    if (profile?.result?._id === id) {
      navigate("/user/profile", { replace: true });
    } else {
      dispatch(getUserProfileData(id));
    }
  }, [dispatch, id, profile, navigate]);

  if (isLoading || !user) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${
    user?.name?.charAt(0) || "A"
  }`;

  const { name, email, bio, profilePhoto, role, designerDetails, socialLinks, location } = user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-[#faf7f3] rounded-xl shadow-md p-6 border border-[#f0e4d3]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profilePhoto || avatarPlaceholder}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-[#44403c] flex items-center gap-2">
              {name}
              {role !== "customer" && (
                <span className="text-sm bg-[#f0e4d3] text-[#aa5a44] px-2 py-1 rounded-full">
                  {roleBadge[role]}
                </span>
              )}
            </h2>
            <p className="text-sm text-[#78716c]">{email}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-[#44403c] mb-1">Bio:</h3>
          <p className="text-sm text-[#78716c]">{bio || "No bio available."}</p>
        </div>

        {/* Designer Details */}
        {(role === "designer" || role === "pending_designer") && designerDetails && (
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#44403c] mb-1">Designer Details:</h3>
            <p className="text-sm text-[#78716c]">
              <strong>Brand:</strong> {designerDetails.brandName || "—"}
            </p>
            <p className="text-sm text-[#78716c]">
              <strong>Portfolio:</strong>{" "}
              {designerDetails.portfolioUrl ? (
                <a
                  href={designerDetails.portfolioUrl}
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
            {designerDetails.appliedAt && (
              <p className="text-sm text-[#78716c]">
                <strong>Applied:</strong>{" "}
                {new Date(designerDetails.appliedAt).toLocaleDateString()}
              </p>
            )}
            {designerDetails.verified && (
              <p className="text-sm text-green-600 font-medium">✔️ Verified</p>
            )}
          </div>
        )}

        {/* Social Links */}
        {socialLinks && (
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#44403c] mb-1">Social Links:</h3>
            {["instagram", "facebook", "twitter", "website"].map(
              (platform) =>
                socialLinks[platform] && (
                  <p key={platform} className="text-sm text-[#78716c]">
                    <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong>{" "}
                    <a
                      href={socialLinks[platform]}
                      className="text-[#aa5a44] underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {socialLinks[platform]}
                    </a>
                  </p>
                )
            )}
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="mb-2">
            <h3 className="text-md font-semibold text-[#44403c] mb-1">Location:</h3>
            <p className="text-sm text-[#78716c]">
              {[location.city, location.state, location.country].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
        )}
      </div>

      {/* Posts */}
      {posts?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#44403c] mb-2">Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h4 className="font-semibold text-[#44403c]">{post.title}</h4>
                <p className="text-sm text-[#78716c] line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {products?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#44403c] mb-2">Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h4 className="font-semibold text-[#44403c]">{product.title}</h4>
                <p className="text-sm text-[#78716c]">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;