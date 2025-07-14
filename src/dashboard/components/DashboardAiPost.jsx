import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const DashboardAiPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "ai-posts"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "ai-posts", id));
    setPosts(posts.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={styles.container}>
      <h2>Saved Drafts</h2>
      {posts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={styles.card}>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Draft" style={styles.image} />
            )}
            <h4>{post.topic}</h4>
            <p><strong>Platform:</strong> {post.platform}</p>
            <p>{post.caption}</p>
            <button onClick={() => handleDelete(post.id)} style={styles.deleteBtn}>
              ❌ Delete
            </button>
            {/* You can add Edit functionality here later */}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "Arial",
  },
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    marginBottom: "1rem",
  },
  deleteBtn: {
    background: "#e63946",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default DashboardAiPost;
