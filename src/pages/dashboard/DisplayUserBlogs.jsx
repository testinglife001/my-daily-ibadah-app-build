// MyBlogPosts.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase";



const DisplayUserBlogs = ({ user }) => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogposts"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserBlogs(blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user]);

  // console.log(userBlogs);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Your Blog Posts</h3>
      {userBlogs.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="row">
          {userBlogs.map((post) => (
            <div className="col-md-4 mb-3" key={post.id}>
              <div className="card h-100">
                {post.imgUrl && <img src={post.imgUrl} className="card-img-top" alt={post.title} />}
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description?.slice(0, 100)}...</p>
                  <p><strong>Category:</strong> {post.category}</p>
                  <p><strong>Tags:</strong> {post.tags?.join(", ")}</p>
                  <p><strong>Trending:</strong> {post.trending}</p>
                  <p className="text-muted"><small>{new Date(post.timestamp?.seconds * 1000).toLocaleString()}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayUserBlogs;
