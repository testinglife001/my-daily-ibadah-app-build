import React, { useEffect, useState } from 'react';
import { getItems } from '../../services/ItemService';
import { createStory, getStories } from '../../services/StoryService';



const StoryManager = () => {
    
  
  const [allItems, setAllItems] = useState([]);
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [itemId, setItemId] = useState('');
  const [subitemId, setSubItemId] = useState('');
  const [subitems, setSubItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const items = await getItems();
      setAllItems(items);
      setStories(await getStories());
    };
    fetchData();
  }, []);

  const mainItems = allItems.filter(item => !item.parentId);
  const subItems = (id) => allItems.filter(item => item.parentId === id);

  const handleItemChange = (id) => {
    setItemId(id);
    setSubItems(subItems(id));
    setSubItemId('');
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!title || !itemId || !subitemId) return alert('All fields required');
    await createStory({ title, content, itemId, subitemId });
    alert('Story created');
    setTitle('');
    setContent('');
    setItemId('');
    setSubItemId('');
    setStories(await getStories());
  };

  return (
    <div>
      <h2>Story Manager</h2>
      <form onSubmit={handleCreateStory}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /><br />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" /><br />

        <select value={itemId} onChange={(e) => handleItemChange(e.target.value)}>
          <option value="">Select Item</option>
          {mainItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select><br />

        <select value={subitemId} onChange={(e) => setSubItemId(e.target.value)} 
            disabled={!subitems.length}>
          <option value="">Select Sub Item</option>
          {subitems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select><br />

        <button type="submit">Create Story</button>
      </form>

      <h3>All Stories</h3>
      <ul>
        {stories.map(s => (
          <li key={s.id}>
            {s.title} - Cat: {s.itemId} / Sub: {s.subitemId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryManager;
