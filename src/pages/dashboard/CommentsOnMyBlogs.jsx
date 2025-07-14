// src/components/profile/CommentsOnMyBlogs.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const CommentsOnMyBlogs = ({ user }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!user?.uid) return;

      const q = query(collection(db, "blogs"), where("userId", "==", user.uid));
      const snap = await getDocs(q);

      const allComments = [];

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const blogId = docSnap.id;
        const blogTitle = data.title;

        if (Array.isArray(data.comments)) {
          data.comments.forEach((comment) => {
            allComments.push({
              ...comment,
              blogId,
              blogTitle,
            });
          });
        }
      });

      setComments(allComments);
    };

    fetchComments();
  }, [user]);

  return (
    <div>
      <h4>Comments on Your Blog Posts</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((c, i) => (
          <div key={i} className="border rounded p-2 mb-2 bg-light">
            <p><strong>{c.name}</strong> on <em>{c.blogTitle}</em>:</p>
            <p>{c.body}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentsOnMyBlogs;
