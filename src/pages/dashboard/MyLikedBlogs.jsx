// src/components/profile/MyLikedBlogs.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const MyLikedBlogs = ({ user }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user?.uid) return;

      const snap = await getDocs(collection(db, "blogs"));
      const posts = snap.docs
        .filter(doc => (doc.data().likes || []).includes(user.uid))
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setLikedPosts(posts);
    };

    fetchLikes();
  }, [user]);

  return (
    <div>
      <h4>Blog Posts You Liked</h4>
      {likedPosts.length === 0 ? (
        <p>You haven't liked any blog posts yet.</p>
      ) : (
        likedPosts.map(post => (
          <div key={post.id} className="border rounded p-2 mb-2 bg-light">
            <strong>{post.title}</strong>
          </div>
        ))
      )}
    </div>
  );
};

export default MyLikedBlogs;
