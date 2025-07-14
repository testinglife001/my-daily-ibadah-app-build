import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const MyLikes = ({ user }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user?.uid) return;
      
      const blogPostsSnap = await getDocs(collection(db, "blogposts"));
      const postPromises = [];

      for (const blogDoc of blogPostsSnap.docs) {
        const likeRef = doc(db, "blogposts", blogDoc.id, "likes", user.uid);
        const likeSnap = await getDoc(likeRef);
        if (likeSnap.exists()) {
          postPromises.push(Promise.resolve({ id: blogDoc.id, ...blogDoc.data() }));
        }
      }

      const posts = await Promise.all(postPromises);
      setLikedPosts(posts);
    };

    fetchLikes();
  }, [user]);

  return (
    <div>
      <h4>Liked Blog Posts</h4>
      {likedPosts.length === 0 ? <p>No liked posts found.</p> :
        likedPosts.map(post => (
          <div key={post.id} className="mb-2 p-2 border rounded bg-light">
            <strong>{post.title}</strong>
          </div>
        ))
      }
    </div>
  );
};

export default MyLikes;
