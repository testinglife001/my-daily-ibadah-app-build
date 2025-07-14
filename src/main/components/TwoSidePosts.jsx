import React from "react";
import "./TwoSidePosts.css";

const leftPosts = [
  {
    id: 1,
    category: "World",
    title: "Featured Post",
    date: "Nov 12",
    excerpt: "This is a wider card with supporting text below.",
    url: "#",
  },
  {
    id: 2,
    category: "Science",
    title: "Latest Discoveries",
    date: "Nov 15",
    excerpt: "Breakthroughs in science are reshaping our understanding.",
    url: "#",
  },
  {
    id: 3,
    category: "Health",
    title: "Health Update",
    date: "Nov 18",
    excerpt: "Recent studies show improvements in mental health awareness.",
    url: "#",
  },
];

const rightPosts = [
  {
    id: 4,
    category: "Design",
    title: "Post Title",
    date: "Nov 11",
    excerpt: "This is a wider card with supporting text below.",
    url: "#",
  },
  {
    id: 5,
    category: "Technology",
    title: "Tech Trends 2025",
    date: "Nov 10",
    excerpt: "An overview of trends shaping future industries.",
    url: "#",
  },
  {
    id: 6,
    category: "Travel",
    title: "Top Destinations",
    date: "Nov 9",
    excerpt: "Explore the most visited places around the world this year.",
    url: "#",
  },
];

export default function TwoSidePosts() {
  return (
    <div className="row mb-5">
      {/* Left column */}
      <div className="col-md-6">
        {leftPosts.map((post) => (
          <div
            key={post.id}
            className="row g-0 post-card shadow-sm position-relative"
          >
            <div className="col p-3 d-flex flex-column position-static">
              <strong className="d-inline-block mb-1 text-primary">
                {post.category}
              </strong>
              <h5 className="mb-1">{post.title}</h5>
              <div className="mb-1 text-muted small">{post.date}</div>
              <p className="mb-1 small">{post.excerpt}</p>
              <a href={post.url} className="stretched-link text-decoration-none small">
                Continue reading →
              </a>
            </div>
            <div className="col-auto d-none d-lg-block">
              <svg
                className="bd-placeholder-img"
                width="120"
                height="150"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder: Thumbnail"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <title>Thumbnail</title>
                <rect width="100%" height="100%" fill="#55595c" />
                <text
                  x="50%"
                  y="50%"
                  fill="#eceeef"
                  dy=".3em"
                  textAnchor="middle"
                  fontSize="16"
                >
                  Thumbnail
                </text>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="col-md-6">
        {rightPosts.map((post) => (
          <div
            key={post.id}
            className="row g-0 post-card shadow-sm position-relative"
          >
            <div className="col p-3 d-flex flex-column position-static">
              <strong className="d-inline-block mb-1 text-success">
                {post.category}
              </strong>
              <h5 className="mb-1">{post.title}</h5>
              <div className="mb-1 text-muted small">{post.date}</div>
              <p className="mb-1 small">{post.excerpt}</p>
              <a href={post.url} className="stretched-link text-decoration-none small">
                Continue reading →
              </a>
            </div>
            <div className="col-auto d-none d-lg-block">
              <svg
                className="bd-placeholder-img"
                width="120"
                height="150"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder: Thumbnail"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <title>Thumbnail</title>
                <rect width="100%" height="100%" fill="#55595c" />
                <text
                  x="50%"
                  y="50%"
                  fill="#eceeef"
                  dy=".3em"
                  textAnchor="middle"
                  fontSize="16"
                >
                  Thumbnail
                </text>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
