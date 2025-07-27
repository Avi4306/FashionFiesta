import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileData } from "../../actions/user";

const roleBadge = {
  designer: "🧵 Designer",
  pending_designer: "⏳ Pending Approval",
  admin: "✔️ Admin",
};

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInProfile = useSelector((state) => state.auth.authData);
  const { isLoading, user, posts, products } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect to private profile if the user is viewing their own profile
    if (loggedInProfile?.result?._id === id) {
      navigate("/user/profile", { replace: true });
    } else {
      dispatch(getUserProfileData(id));
    }
  }, [dispatch, id, loggedInProfile, navigate]);

  if (isLoading || !user) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${
    user.name?.charAt(0) || "A"
  }`;

  const { name, email, bio, profilePhoto, role, designerDetails, socialLinks, location } = user;

  const postsToShow = posts?.slice(0, 6);
  const productsToShow = products?.slice(0, 6);

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

      {/* Posts Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-[#44403c] mb-4">Posts</h3>
        {postsToShow?.length > 0 ? (
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
                  <p className="text-sm text-[#78716c] line-clamp-2">{post.content || "No content"}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#78716c]">This user has not created any posts yet.</p>
        )}
        {posts?.length > 6 && (
          <Link
            to={`/users/${id}/posts`}
            className="mt-4 w-full text-center block text-[#aa5a44] border border-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]"
          >
            View All Posts ({posts.length})
          </Link>
        )}
      </div>

      {/* Products Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-[#44403c] mb-4">Products</h3>
        {productsToShow?.length > 0 ? (
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
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-[#44403c]">{product.title}</h4>
                  <p className="text-sm text-[#78716c] line-clamp-2">{product.description || "No description"}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#78716c]">This user has not created any products yet.</p>
        )}
        {products?.length > 6 && (
          <Link
            to={`/users/${id}/products`}
            className="mt-4 w-full text-center block text-[#aa5a44] border border-[#aa5a44] py-2 rounded-lg hover:bg-[#f3e5dc]"
          >
            View All Products ({products.length})
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserDetails;