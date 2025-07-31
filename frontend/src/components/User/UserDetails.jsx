import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserProfileData } from "../../actions/user";
import { PhotoIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, UserCircleIcon, BriefcaseIcon, GlobeAltIcon, LinkIcon } from "@heroicons/react/24/solid"; // Added new icons

const UserDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user, posts, products, isLoading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUserProfileData(id));
  }, [dispatch, id]);

  const avatar =
    user?.avatar ||
    `https://placehold.co/80x80/F0E4D3/44403c?text=${user?.name?.charAt(0) || "U"}`;

  const postsToShow = posts?.slice(0, 4);
  const productsToShow = products?.slice(0, 4);

  // Helper component for rendering info items
  const InfoItem = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 text-[#77736c]">{icon}</div>
      <div className="flex-grow">
        <dt className="text-sm font-medium text-[#44403c]">{label}</dt>
        <dd className="mt-1 text-sm text-[#77736c] break-words">{children || "N/A"}</dd>
      </div>
    </div>
  );

  // Skeleton component for a grid of cards
  const SkeletonGrid = ({ cards = 4, height = "h-56" }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className={`bg-stone-200 rounded-lg ${height} animate-pulse`}
        />
      ))}
    </div>
  );

  // Unified skeleton loader for the entire page
  const PageSkeletonLoader = () => (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-4">
        <div className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-stone-200 rounded-full" />
            <div className="w-40 h-4 bg-stone-300 rounded mt-4" />
            <div className="w-48 h-3 bg-stone-200 rounded mt-2" />
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
          <div className="h-6 w-32 bg-stone-300 rounded mb-4" />
          <SkeletonGrid cards={2} height="h-56" />
        </div>
        <div className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
          <div className="h-6 w-32 bg-stone-300 rounded mb-4" />
          <SkeletonGrid cards={2} height="h-72" />
        </div>
      </div>
    </div>
  );

  if (isLoading || !user) {
    return <PageSkeletonLoader />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* --- Left Column (User Info) --- */}
      <aside className="lg:col-span-4 lg:sticky lg:top-8 self-start">
        <section className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
          <div className="flex flex-col items-center text-center pb-6">
            <img
              src={avatar}
              alt={user?.name || "User"}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
            />
            <h1 className="text-2xl font-bold text-[#44403c] mt-4">{user?.name || "No Name"}</h1>
            <p className="text-sm text-[#77736c]">{user?.bio || "No bio provided."}</p>
          </div>
          <div className="space-y-4 border-t border-[#f0e4d3] pt-6">
                <InfoItem icon={<UserCircleIcon />} label="Bio">
                  {user.bio || "No bio provided."}
                </InfoItem>

                {user.role !== "customer" && (
                  <>
                    <InfoItem icon={<BriefcaseIcon />} label="Brand">
                      {user.designerDetails?.brandName || "N/A"}
                    </InfoItem>
                    <InfoItem icon={<LinkIcon />} label="Portfolio">
                      {user.designerDetails?.portfolioUrl ? (
                        <a
                          href={user.designerDetails.portfolioUrl}
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
                    user.location?.city,
                    user.location?.state,
                    user.location?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </InfoItem>
                <InfoItem icon={<GlobeAltIcon />} label="Social Links">
                  <div className="space-y-1">
                    {Object.entries(user.socialLinks).map(([key, value]) => (
                      <p key={key} className="text-sm text-[#78716c]">
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                        {value || "N/A"}
                      </p>
                    ))}
                  </div>
                </InfoItem>
              </div>
        </section>
      </aside>

      {/* --- Right Column (Posts & Products) --- */}
      <div className="lg:col-span-8 mt-8 lg:mt-0 space-y-8">
        {/* Posts */}
        <section className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#44403c]">Latest Posts</h3>
            {posts?.length > 4 && (
              <Link
                to={`/user/${id}/posts`}
                className="text-sm font-medium text-[#aa5a44] hover:underline"
              >
                See All ({posts.length}) &rarr;
              </Link>
            )}
          </div>
          {postsToShow?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {postsToShow.map((post) => (
                <div
                  key={post._id}
                  className="group border rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link to = {`/style-diaries/${post._id}`}>
                  <img
                    src={post.selectedFiles?.[0]}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-t-lg transition-transform group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-md text-[#44403c] truncate mb-1">
                      {post.title}
                    </h4>
                    <p className="text-sm text-[#77736c] line-clamp-2">
                      {post.content || "No content"}
                    </p>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <PhotoIcon className="h-5 w-5" />
              This user hasn't shared any posts yet.
            </div>
          )}
        </section>

        {/* Products */}
        <section className="bg-[#faf7f3] p-6 rounded-xl border border-[#f0e4d3]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#44403c]">Latest Products</h3>
            {products?.length > 4 && (
              <Link
                to={`/user/${id}/products`}
                className="text-sm font-medium text-[#aa5a44] hover:underline"
              >
                See All ({products.length}) &rarr;
              </Link>
            )}
          </div>
          {productsToShow?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productsToShow.map((product) => (
                <div
                  key={product._id}
                  className="group border rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link to = {`/products/${product._id}`}>
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg transition-transform group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-md text-[#44403c] truncate mb-1">
                      {product.title}
                    </h4>
                    <p className="text-sm text-[#77736c] line-clamp-2">
                      {product.description || "No description"}
                    </p>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5" />
              This user doesn't have any products for sale yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserDetails;