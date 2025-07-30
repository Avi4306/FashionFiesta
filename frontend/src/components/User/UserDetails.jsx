import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileData } from "../../actions/user";

// --- Heroicon Imports ---
import {
  MapPinIcon,
  LinkIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  PhotoIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

// --- Helper Components ---

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-5 h-5 text-[#78716c]">{icon}</div>
    <div className="flex-grow">
      <dt className="text-sm font-medium text-[#44403c]">{label}</dt>
      <dd className="mt-1 text-sm text-[#78716c] break-words">{children}</dd>
    </div>
  </div>
);


const PreviewCard = ({ to, image, title, description, placeholderIcon, size = 'small' }) => {
  const sizeStyles = {
    small: 'h-55', 
    large: 'h-80', 
  };

  return (
    <Link
      to={to}
      className="group flex flex-col bg-white rounded-lg border border-[#f0e4d3] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className={`${sizeStyles[size]} bg-white flex items-center justify-center overflow-hidden`}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d6d3d1]">
            <div className="w-10 h-10">{placeholderIcon}</div>
          </div>
        )}
      </div>
      <div className="p-4 rounded-2xl flex flex-col flex-grow bg-[#faf7f3] border-8 border-white">
        <div>
          <h4 className="font-semibold text-lg text-[#44403c] truncate group-hover:text-[#aa5a44] transition-colors">
            {title}
          </h4>
          <p className="text-sm text-[#78716c] mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const EmptyContent = ({ message, icon }) => (
  <div className="text-center bg-[#faf7f3] border-2 border-dashed border-[#f0e4d3] rounded-lg p-8">
    <div className="mx-auto h-12 w-12 text-[#d6d3d1]">{icon}</div>
    <p className="mt-4 text-sm text-[#78716c]">{message}</p>
  </div>
);


const SkeletonLoader = () => (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Skeleton */}
            <div className="lg:col-span-4">
                <div className="bg-[#faf7f3] rounded-xl p-6 border border-[#f0e4d3]">
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 rounded-full bg-stone-300"></div>
                        <div className="h-6 w-40 bg-stone-300 rounded mt-4"></div>
                        <div className="h-4 w-48 bg-stone-200 rounded mt-2"></div>
                    </div>
                    <div className="space-y-6 mt-6 border-t border-[#f0e4d3] pt-6">
                        <div className="h-12 w-full bg-stone-200 rounded"></div>
                        <div className="h-12 w-full bg-stone-200 rounded"></div>
                        <div className="h-12 w-2/3 bg-stone-200 rounded"></div>
                    </div>
                </div>
            </div>
            {/* Right Skeleton */}
            <div className="lg:col-span-8 mt-8 lg:mt-0 space-y-8">
                {/* Posts Skeleton */}
                <div className="bg-[#faf7f3] rounded-xl p-6 border border-[#f0e4d3]">
                    <div className="h-6 w-32 bg-stone-300 rounded mb-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-56 bg-stone-200 rounded-lg"></div>
                        <div className="h-56 bg-stone-200 rounded-lg"></div>
                    </div>
                </div>
                 {/* Products Skeleton (taller) */}
                <div className="bg-[#faf7f3] rounded-xl p-6 border border-[#f0e4d3]">
                    <div className="h-6 w-32 bg-stone-300 rounded mb-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-72 bg-stone-200 rounded-lg"></div>
                        <div className="h-72 bg-stone-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


// --- Main Component ---

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInProfile = useSelector((state) => state.auth.authData);
  const { isLoading, user, posts, products } = useSelector((state) => state.user);

  useEffect(() => {
    if (loggedInProfile?.result?._id === id) {
      navigate("/user/profile", { replace: true });
    } else {
      dispatch(getUserProfileData(id));
    }
  }, [dispatch, id, loggedInProfile, navigate]);

  if (isLoading || !user) {
    return <SkeletonLoader />;
  }

  const { name, email, bio, profilePhoto, role, designerDetails, socialLinks, location } = user;
  const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f0e4d3&color=44403c`;
  const postsToShow = posts?.slice(0, 4);
  const productsToShow = products?.slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* --- Left Sticky Column --- */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 self-start">
            <div className="bg-[#faf7f3] rounded-xl shadow-sm p-6 border border-[#f0e4d3]">
              <div className="flex flex-col items-center text-center pb-6">
                <img src={profilePhoto || avatarPlaceholder} alt={name} className="w-28 h-28 rounded-full object-cover ring-4 ring-white" />
                <h1 className="text-2xl font-bold text-[#44403c] mt-4">{name}</h1>
                <p className="text-sm text-[#78716c]">{designerDetails?.brandName || email}</p>
                {designerDetails?.verified && (
                  <div className="flex items-center gap-1.5 text-green-600 mt-2">
                    <CheckBadgeIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">Verified Designer</span>
                  </div>
                )}
              </div>

              <div className="space-y-6 border-t border-[#f0e4d3] pt-6">
                <InfoItem icon={<PencilSquareIcon />} label="Bio">{bio || "No bio provided."}</InfoItem>
                {location && <InfoItem icon={<MapPinIcon />} label="Location">{[location.city, location.state, location.country].filter(Boolean).join(", ")}</InfoItem>}
                {designerDetails?.portfolioUrl && <InfoItem icon={<LinkIcon />} label="Portfolio"><a href={designerDetails.portfolioUrl} target="_blank" rel="noreferrer" className="text-[#aa5a44] hover:underline font-medium">View Portfolio</a></InfoItem>}
              </div>
              
              {socialLinks && (
                <div className="mt-6 border-t border-[#f0e4d3] pt-6 flex justify-center space-x-5">
                    {/* Social Icons would go here */}
                </div>
              )}
            </div>
          </aside>

          {/* --- Right Content Column --- */}
          <main className="lg:col-span-8 mt-8 lg:mt-0 space-y-8">
            {/* Posts Section */}
            <section className="bg-[#faf7f3] rounded-xl shadow-sm p-6 border border-[#f0e4d3]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#44403c]">Latest Posts</h3>
                {posts?.length > 4 && <Link to={`/user/${id}/posts`} className="text-sm font-medium text-[#aa5a44] hover:underline">See All ({posts.length}) &rarr;</Link>}
              </div>
              {postsToShow?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* No size prop needed, defaults to 'small' */}
                  {postsToShow.map((post) => <PreviewCard key={post._id} to={`/style-diaries/${post._id}`} image={post.image} title={post.title} description={post.content || "No content"} placeholderIcon={<PhotoIcon />} />)}
                </div>
              ) : (
                <EmptyContent message="This user hasn't shared any posts yet." icon={<PhotoIcon />}/>
              )}
            </section>

            {/* Products Section */}
            <section className="bg-[#faf7f3] rounded-xl shadow-sm p-6 border border-[#f0e4d3]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#44403c]">Products</h3>
                {products?.length > 4 && <Link to={`/user/${id}/products`} className="text-sm font-medium text-[#aa5a44] hover:underline">See All ({products.length}) &rarr;</Link>}
              </div>
              {productsToShow?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 
                  {productsToShow.map((product) => <PreviewCard key={product._id} to={`/products/${product._id}`} image={product.images?.[0]} title={product.title} description={product.description || "No description"} placeholderIcon={<ShoppingBagIcon />} size="large" />)}
                </div>
              ) : (
                <EmptyContent message="This user doesn't have any products for sale yet." icon={<ShoppingBagIcon />}/>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;