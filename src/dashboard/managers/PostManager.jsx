import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/CategoryService';
import { createPost, getPosts } from '../../services/PostService';



const PostManager = () => {


  const [allCategories, setAllCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcats, setSubcats] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const cats = await getCategories();
      setAllCategories(cats);
      setPosts(await getPosts());
    };
    fetch();
  }, []);

  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setSubcats(allCategories.filter(c => c.parentId === id));
    setSubcategoryId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !subcategoryId) return alert('Fill all fields');
    await createPost({ title, content, categoryId, subcategoryId });
    setTitle('');
    setContent('');
    setCategoryId('');
    setSubcategoryId('');
    setPosts(await getPosts());
  };

  const mainCats = allCategories.filter(c => !c.parentId);

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" /><br />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" /><br />
        <select value={categoryId} onChange={e => handleCategoryChange(e.target.value)}>
          <option value="">Select Category</option>
          {mainCats.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select><br />
        <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)}>
          <option value="">Select Subcategory</option>
          {subcats.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select><br />
        <button type="submit">Post</button>
      </form>

      <h3>All Posts</h3>
      <ul>
        {posts.map(p => (
          <li key={p.id}>{p.title} | Cat: {p.categoryId} / Sub: {p.subcategoryId}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostManager;
