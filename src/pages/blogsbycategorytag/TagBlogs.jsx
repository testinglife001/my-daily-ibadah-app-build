// src/pages/TagBlogs.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import BlogsList from "../../components/homemain/BlogsList";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";

const TagBlogs = ({ setActive, user }) => {
  const [tagBlogs, setTagBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tag } = useParams();

  useEffect(() => {
    const getTagBlogs = async () => {
      setLoading(true);
      try {
        const blogRef = collection(db, "blogs");
        const tagBlogQuery = query(blogRef, where("tags", "array-contains", tag));
        const docSnapshot = await getDocs(tagBlogQuery);
        const blogs = docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTagBlogs(blogs);
      } catch (err) {
        console.error("Error fetching blogs by tag:", err);
      }
      setLoading(false);
    };

    getTagBlogs();
    setActive(null);
  }, [tag, setActive]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container my-5">
      <div className="blog-heading text-center py-2 mb-4">
        Tag: <strong>{tag.toUpperCase()}</strong>
      </div>
      {tagBlogs.length === 0 ? (
        <p className="text-center">No blogs found for this tag.</p>
      ) : (
        <BlogsList blogs={tagBlogs} user={user} />
      )}
    </div>
  );
};

export default TagBlogs;
