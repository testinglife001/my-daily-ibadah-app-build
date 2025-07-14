import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const CommentsOnMyPosts = ({ user }) => {
  const [comments, setComments] = useState([]);



  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, "comments"), where("userId", "==", user.uid));
      const snap = await getDocs(q);

      const commentData = await Promise.all(
        snap.docs.map(async docSnap => {
          const data = docSnap.data();
          const postRef = doc(db, "blogposts", data.postId);
          const postDoc = await getDoc(postRef);
          return {
            id: docSnap.id,
            ...data,
            postTitle: postDoc.exists() ? postDoc.data().title : "Unknown Post"
          };
        })
      );

      setComments(commentData);
    };

    if (user?.uid) fetchComments();
  }, [user]);

  return (
    <div>
      <h4>Comments on Your Posts</h4>
      {comments.map(c => (
        <div key={c.id} className="border rounded p-2 mb-2 bg-light">
          <p><strong>{c.commenterName}</strong> on <em>{c.postTitle}</em>:</p>
          <p>{c.commentText}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsOnMyPosts;
