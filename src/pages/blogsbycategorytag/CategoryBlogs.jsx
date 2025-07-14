// src/pages/CategoryBlogs.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import BlogsList from "../../components/homemain/BlogsList";
import Spinner from "../../components/Spinner";

export default function CategoryBlogs({ user }) {
  const { categoryId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      setLoading(true);
      try {
        // First get the name of the category/subcategory by ID
        const catSnap = await getDocs(collection(db, "categories"));
        const allCats = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const matchedCat = allCats.find((c) => c.id === categoryId);

        if (!matchedCat) {
          console.warn("Category not found");
          setLoading(false);
          return;
        }

        const catName = matchedCat.name;
        setCategoryName(catName);

        // Now get blogs where category or subcategory name matches
        const blogRef = collection(db, "blogs");
        const catQuery = query(blogRef, where("categoryTitle", "==", catName));
        const subcatQuery = query(blogRef, where("subcategoryTitle", "==", catName));

        const [catSnapBlogs, subcatSnapBlogs] = await Promise.all([
          getDocs(catQuery),
          getDocs(subcatQuery),
        ]);

        const allBlogs = [
          ...catSnapBlogs.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ...subcatSnapBlogs.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ];

        setBlogs(allBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
      setLoading(false);
    };

    fetchCategoryBlogs();
  }, [categoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="container my-5">
      <h3 className="mb-4">🗂 Blogs in: {categoryName}</h3>
      {blogs.length === 0 ? (
        <p>No blogs found in this category.</p>
      ) : (
        <BlogsList blogs={blogs} user={user} />
      )}
    </div>
  );
}
