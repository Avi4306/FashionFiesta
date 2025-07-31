import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../actions/posts.js"; // assumes pagination support
import Post from "./Post/Post.jsx";
import PostSkeleton from "./Post/PostSkeleton.jsx";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, hasMore } = useSelector((state) => state.posts);
  const postList = posts?.data || [];
  
  const [page, setPage] = useState(1);

  const observer = useRef();

  const lastPostRef = useCallback( //This is a React hook that memoizes the function so it doesn't get recreated on every render unless dependencies change. It's optional but helps performance.
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => { //IntersectionObserver is a browser API that watches when an element becomes visible (e.g., when a post scrolls into view).
        if (entries[0].isIntersecting && hasMore && !isLoading) { //entries[0].isIntersecting checks if the watched element is visible on screen.
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node); //This attaches the observer to the actual HTML element (which will be the last post).
    },
    [isLoading, hasMore]
  );
  


  useEffect(() => {
    dispatch(getPosts(page));
  }, [dispatch, page]);

  return (
    <main className="bg-page-bg p-4 md:p-8">
      {(!postList.length && !isLoading) && (
        <div className="text-center p-10">
          <h2 className="text-xl font-semibold text-text-primary">No Posts Found</h2>
          <p className="text-text-secondary">It's quiet in here... why not create one?</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
        {postList.map((post, index) =>
          postList.length === index + 1 ? (
            <div ref={lastPostRef} key={post._id}>
              <Post post={post} />
            </div>
          ) : (
            <Post key={post._id} post={post} />
          )
        )}

        {/* Initial Load Skeletons */}
        {isLoading && postList.length === 0 &&
          Array.from({ length: 8 }).map((_, i) => <PostSkeleton key={i} />)}

        {/* Optional: show 1–2 skeletons during infinite scroll */}
        {isLoading && postList.length > 0 &&
          Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={`sk-${i}`} />)}
      </div>

      {isLoading && (
        <div className="text-center mt-6 text-text-secondary">Loading more...</div>
      )}
    </main>
  );
};

export default Posts;