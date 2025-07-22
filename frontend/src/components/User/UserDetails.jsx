import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../actions/user";

const roleBadge = {
  designer: "Designer",
  pending_designer: "Pending Approval",
  admin: "Admin",
};

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isLoading, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch, id]);

  if (isLoading || !user) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${
    user?.name?.charAt(0) || "A"
  }`;

  const { name, email, bio, profilePhoto, role, designerDetails, socialLinks, location } = user;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
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
            {["instagram", "facebook", "twitter", "website"].map((platform) => (
              socialLinks[platform] ? (
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
              ) : null
            ))}
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
    </div>
  );
};

export default UserDetails;