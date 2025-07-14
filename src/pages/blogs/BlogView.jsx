import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createReactEditorJS } from 'react-editor-js';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';






const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const ReactEditorJS = createReactEditorJS();

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, 'blogs', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setBlog({ id: snapshot.id, ...data });
      } else {
        setBlog(null);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      alert('Blog deleted successfully!');
      navigate('/all-blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  if (loading) return <p className="text-center my-5">Loading...</p>;
  if (!blog) return <p className="text-center text-danger">Blog not found.</p>;

  return (
    <div className="container mt-5">
      <h2>{blog.title}</h2>
      <p><strong>Category:</strong> {blog.category}</p>
      {blog.imgUrl && (
        <img src={blog.imgUrl} alt={blog.title} className="img-fluid mb-4" />
      )}

      {blog.description && (
        <div className="blog-content">
          {parse(draftToHtml(blog.description))}
        </div>
      )}

      <Link to={`/edit-blog/${blog.id}`} className="btn btn-warning">Edit Blog</Link>
      <button onClick={handleDelete} className="btn btn-danger ms-2">Delete Blog</button>
    </div>
  );
};

export default BlogView;
