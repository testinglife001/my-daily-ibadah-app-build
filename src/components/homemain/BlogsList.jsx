import React, { useState } from "react";
import "./BlogsList.css";
import { excerpt } from "../../utils";
import { Link } from "react-router-dom";

export default function BlogsList({
  blogs = [],
  user,
  handleDelete,
}) {
  const [isGridView, setIsGridView] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 initially

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6); // Show 6 more on each click
  };

  const visibleBlogs = blogs.slice(0, visibleCount);

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Latest Blog Posts</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${isGridView ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setIsGridView(true)}
          >
            Grid View
          </button>
          <button
            className={`btn btn-sm ${!isGridView ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setIsGridView(false)}
          >
            List View
          </button>
        </div>
      </div>

      <div className={`row g-4 ${isGridView ? "" : "flex-column"}`}>
        {visibleBlogs.map((blog) => (
          <div key={blog.id} className={isGridView ? "col-md-4" : "col-12"}>
            <div
              className={`card h-100 shadow-sm ${!isGridView ? "flex-md-row" : ""}`}
            >
              <div className={isGridView ? "" : "col-md-4"}>
                <img
                  src={blog.imgUrl}
                  alt={blog.title}
                  className={`img-fluid ${isGridView ? "card-img-top" : "rounded-start h-100 object-fit-cover"}`}
                  style={{
                    width: "100%",
                    height: isGridView ? "200px" : "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                className={`p-3 d-flex flex-column justify-content-between ${isGridView ? "" : "col-md-8"}`}
              >
                <div>
                  <h5 className="card-title">{blog.title}</h5>
                  <div className="text-muted mb-2 small">
                    {blog.timestamp?.toDate().toDateString()}
                  </div>
                  <p className="card-text small">
             
                    {blog.description.substring(0, 50)}{blog.description.length > 50 && '...'}
                  </p>
                </div>
                <div className="mt-auto">
                  <Link
                    to={`/details/${blog.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < blogs.length && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="btn btn-outline-secondary"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
