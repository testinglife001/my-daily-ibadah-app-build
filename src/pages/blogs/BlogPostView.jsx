// src/pages/BlogPostDetails.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
 import EditorOutput from "./EditorOutput"; // <- renders EditorJS content
import { Card, Container } from "react-bootstrap";

const BlogPostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "blogposts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }} >
      <div className="d-flex justify-content-between mb-3" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }} >
        <button className="btn btn-success" style={{ backgroundColor: "green", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px" }} >
          <Link  to={`/add-note/blog-post/${post.id}`} style={{color:'white', textDecoration:'none'}} >Add Note</Link>
        </button>
        

        <button className="btn btn-primary" style={{ backgroundColor: "blue", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px" }} >
          <Link  to={`/view-notes/blog-post/${post.id}`} style={{color:'white', textDecoration:'none'}} >Show Note</Link>
        </button>
      </div>
      <h2>{post.title}</h2>
      <p><strong>By:</strong> {post.author}</p>
      <p><strong>Category:</strong> {post.category}</p>
      <img src={post.imgUrl} alt={post.title} className="img-fluid mb-4" />
      <div className="mb-4">
        <strong>Description:</strong>
        <p>{post.description}</p>
      </div>

      {/* Converted Card to plain div */}
      <div className="card mb-4">
        <div className="card-body" style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "1rem", marginBottom: "2rem", backgroundColor: "#fafafa" }} >
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.description}</p>

          {post.imgUrl && (
            <img src={post.imgUrl} className="img-fluid mb-3" alt="blog" style={{ maxWidth: "100%", marginBottom: "1rem" }} />
          )}

          {post.audioUrl && (
            <div className="mb-3" style={{ marginBottom: "1rem" }} >
              <h6>🎧 Audio</h6>
              <audio controls style={{ width: "100%" }}>
                <source src={post.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {post.videoUrl && (
            <div className="mb-3" style={{ marginBottom: "1rem" }} >
              <h6>🎥 Video</h6>
              <video controls style={{ width: "100%" }}>
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>


      <div>
        <EditorOutput data={post.content} />
      </div>
    </div>
  );
};

export default BlogPostView;