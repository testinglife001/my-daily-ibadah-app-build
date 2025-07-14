// src/pages/HomePageAlt.jsx
import React, { useState } from "react";
// import "./HomePageAlt.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HeaderImgAlt from "./HeaderImgAlt";
import SidebarAlt from "./SidebarAlt";
import Posts from '../../components/home/posts/Posts';


const HomePageAlt = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "My First Blog Post",
      date: "June 30, 2024",
      author: "You",
      content: "This is the first dynamic blog post content."
    },
    {
      id: 2,
      title: "Another Post",
      date: "June 29, 2024",
      author: "Someone",
      content: "Another interesting post content."
    }
  ]);

  return (
    <div >
      <HeaderImgAlt />
        <div className="homepage">
      <div className="container-fluid">

        <button
          className="btn btn-primary d-md-none mb-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>
        
        <div className="row g-5">
          <div className="col-md-8">
            <h3 className="pb-4 mb-4 fst-italic border-bottom">From the Firehose</h3>
            
            {/* Map over posts */} 
            {posts.map((post) => (
              <article key={post.id} className="blog-post mb-4">
                <h2 className="display-5 mb-1">{post.title}</h2>
                <p className="blog-post-meta">
                  {post.date} by <a href="#">{post.author}</a>
                </p>
                <p>{post.content}</p>
              </article>
            ))} 

            <Posts /><Posts /><Posts /><Posts /><Posts />
            
          </div>

         

          {/* On small screens, sidebar toggles */}
          <div
            className={`col-md-4 ${sidebarOpen ? "d-block" : "d-none d-md-block"}`}
            id="sidebar"
          >
            <SidebarAlt />
          </div> 
        </div>
      </div>
      </div>
    </div>
  );
};



export default HomePageAlt;
