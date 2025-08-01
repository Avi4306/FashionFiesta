<<<<<<< HEAD
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../actions/posts.js"; // assumes pagination support
import Post from "./Post/Post.jsx";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, hasMore } = useSelector((state) => state.posts);
  console.log(posts)
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
      </div>

      {isLoading && (
        <div className="text-center mt-6 text-text-secondary">Loading more...</div>
      )}
=======
import Post from "./Post/Post.jsx";
import { useSelector } from "react-redux";
import { useState } from "react";

const Posts = () => {
  const { isLoading, posts } = useSelector((state) => state.posts);
  const [currentId, setCurrentId] = useState(0);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <Post key={post?._id} post={post} setCurrentId={setCurrentId} />
        ))}
      </div>
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    </main>
  );
};

export default Posts;