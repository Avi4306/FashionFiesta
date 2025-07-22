import Post from "./Post/Post.jsx";
import { useSelector } from "react-redux";
import { useState } from "react";

const Posts = () => {
  const { isLoading, posts } = useSelector((state) => state.posts);

  if (isLoading) {
    return <div className="text-center p-10 text-text-secondary">Loading...</div>;
  }

  if (!posts.length) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold text-text-primary">No Posts Found</h2>
        <p className="text-text-secondary">It's quiet in here... why not create one?</p>
      </div>
    );
  }

  return (
    // Using custom background color and Tailwind's grid system
    <main className="bg-page-bg p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
        {posts.map((post) => (
          <Post key={post?._id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Posts;