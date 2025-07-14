import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { db } from '../../firebase';

const AllBlogList = () => {

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
        const snapshot = await getDocs(collection(db, 'blogs'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(data);
        };
        fetchBlogs();
    }, []);

  return (
    <div>
        <div className="container mt-5">
        <h2>All Blog List</h2>
        <div className="row">
            {blogs.map((blog) => (
            <div key={blog.id} className="col-md-4 mb-4">
                <div className="card">
                <img src={blog.imgUrl} className="card-img-top" alt={blog.title} />
                <div className="card-body">
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text">{blog.category}</p>
                    <Link to={`/view-blog/${blog.id}`} className="btn btn-primary">Read More</Link>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default AllBlogList