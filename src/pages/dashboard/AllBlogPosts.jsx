import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";


const AllBlogPosts = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogposts"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h4>All Blog Posts</h4>
      {allPosts.map(post => (
        <div key={post.id}>
          <h5>{post.title}</h5>
          <p>{post.description?.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default AllBlogPosts;
