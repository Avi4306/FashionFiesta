import React from "react";
import "./Blog.css";
import BlogCarousel from './BlogCarousel'
export default function Blog() {
  return (
    <div className="blog-container grid grid-cols-2 grid-rows-1 gap-4 h-full w-full">
      <div>
        <h1 className="text-6xl font-medium leading-[6rem] tracking-[0.5rem]"><i>“STYLE <br /> diaries”</i>: <br /> real people,<br /> real looks!</h1>
      </div>
      
        <div><BlogCarousel/></div>
      
    </div>
  );
}
