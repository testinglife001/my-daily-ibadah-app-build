// src/components/Dashboard/AllBlogsPosts.jsx
import React, { useState } from "react";
import CommentSection from "./CommentSection";
import { useRealtimeCollection } from "./useRealtimeCollection";
import { FavoriteButton, LikeButton } from "./LikeFavoriteButtons";
import CommentsSection from "./CommentsSection";


export default function AllBlogsPosts({ user }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const posts = useRealtimeCollection("blogposts");

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterCat || p.category === filterCat)
  );
  const categories = [...new Set(posts.map(p => p.category))];

  // console.log(user);

  return (
    <div>
      <h4>All Posts</h4>
      <div className="mb-3 d-flex flex-wrap gap-2">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search titles..." className="form-control" style={{ width: "200px" }}
        />
        <select
          value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="form-select" style={{ width: "200px" }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <button className="btn btn-outline-secondary" onClick={() => { setSearch(""); setFilterCat(""); }}>Reset</button>
      </div>

      {filtered.map(p => (
        <div key={p.id} className="mb-4 p-3 border rounded">
          <h5>{p.title}</h5>
          <small>{p.category} – {new Date(p.timestamp?.seconds * 1000).toLocaleString()}</small>
          <p>{p.description}</p>

          {user && (
            <div className="mb-2">
              <LikeButton postId={p.id} user={user} />
              &nbsp;
              <FavoriteButton postId={p.id} user={user} className="ms-2" />
            </div>
          )}
          
          {/*<CommentSection postId={p.id} user={user} />*/}
          <CommentsSection postId={p.id} user={user} />

        </div>
      ))}
    </div>
  );
}
