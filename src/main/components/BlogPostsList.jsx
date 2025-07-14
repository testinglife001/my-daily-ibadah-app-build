import React, { useState } from "react";
import "./BlogPostsList.css"; // Optional: Add your custom styling

const posts = [
  {
    id: 1,
    title: "Understanding React Server Components",
    date: "June 29, 2025",
    excerpt:
      "React Server Components enable rendering on the server without sending unnecessary JS to the client...",
    image: "https://source.unsplash.com/random/400x200?react",
    url: "#",
  },
  {
    id: 2,
    title: "Modern CSS Grid Layout Tricks",
    date: "June 28, 2025",
    excerpt:
      "Explore powerful layout capabilities with modern CSS Grid including subgrids, named lines, and more...",
    image: "https://source.unsplash.com/random/400x200?css",
    url: "#",
  },
  {
    id: 3,
    title: "Beginner's Guide to TypeScript",
    date: "June 25, 2025",
    excerpt:
      "TypeScript adds static typing to JavaScript, helping catch bugs early and improve code quality...",
    image: "https://source.unsplash.com/random/400x200?typescript",
    url: "#",
  },
  {
    id: 4,
    title: "Understanding React Server Components",
    date: "June 29, 2025",
    excerpt:
      "React Server Components enable rendering on the server without sending unnecessary JS to the client...",
    image: "https://source.unsplash.com/random/400x200?react",
    url: "#",
  },
  {
    id: 5,
    title: "Modern CSS Grid Layout Tricks",
    date: "June 28, 2025",
    excerpt:
      "Explore powerful layout capabilities with modern CSS Grid including subgrids, named lines, and more...",
    image: "https://source.unsplash.com/random/400x200?css",
    url: "#",
  },
  {
    id: 6,
    title: "Beginner's Guide to TypeScript",
    date: "June 25, 2025",
    excerpt:
      "TypeScript adds static typing to JavaScript, helping catch bugs early and improve code quality...",
    image: "https://source.unsplash.com/random/400x200?typescript",
    url: "#",
  },
  {
    id: 7,
    title: "Understanding React Server Components",
    date: "June 29, 2025",
    excerpt:
      "React Server Components enable rendering on the server without sending unnecessary JS to the client...",
    image: "https://source.unsplash.com/random/400x200?react",
    url: "#",
  },
  {
    id: 8,
    title: "Modern CSS Grid Layout Tricks",
    date: "June 28, 2025",
    excerpt:
      "Explore powerful layout capabilities with modern CSS Grid including subgrids, named lines, and more...",
    image: "https://source.unsplash.com/random/400x200?css",
    url: "#",
  },
  {
    id: 9,
    title: "Beginner's Guide to TypeScript",
    date: "June 25, 2025",
    excerpt:
      "TypeScript adds static typing to JavaScript, helping catch bugs early and improve code quality...",
    image: "https://source.unsplash.com/random/400x200?typescript",
    url: "#",
  },
];

export default function BlogPostsList() {
  const [isGridView, setIsGridView] = useState(true);

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
        {posts.map((post) => (
          <div key={post.id} className={isGridView ? "col-md-4" : "col-12"}>
            <div
              className={`card h-100 shadow-sm ${!isGridView ? "flex-md-row" : ""}`}
            >
              <div className={isGridView ? "" : "col-md-4"}>
                <img
                  src={post.image}
                  alt={post.title}
                  className={`img-fluid ${isGridView ? "card-img-top" : "rounded-start h-100 object-fit-cover"}`}
                  style={{ width: "100%", height: isGridView ? "200px" : "100%", objectFit: "cover" }}
                />
              </div>
              <div className={`p-3 d-flex flex-column justify-content-between ${isGridView ? "" : "col-md-8"}`}>
                <div>
                  <h5 className="card-title">{post.title}</h5>
                  <div className="text-muted mb-2 small">{post.date}</div>
                  <p className="card-text small">{post.excerpt}</p>
                </div>
                <a
                  href={post.url}
                  className="stretched-link text-decoration-none text-primary small fw-bold"
                >
                  Continue reading →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
