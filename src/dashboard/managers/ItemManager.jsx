// CategoryManager.jsx
import React, { useEffect, useState } from 'react';
import { addItem, deleteItem, getItems, updateItem } from '../../services/ItemService';
import { buildItemTree } from './buildItemTree';



const ItemNode = ({ node, onAddSub, onDelete, onRename }) => {

  const [newName, setNewName] = useState(node.name);

  return (
    <div style={{ marginLeft: 20 }}>
      <div>
        <strong>{node.name}</strong>
        <button onClick={() => onAddSub(node.id)}>+ Sub</button>
        <button onClick={() => onDelete(node.id)}>🗑</button>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => onRename(node.id, newName)}
        />
      </div>
      {node.children &&
        node.children.map((child) => (
          <ItemNode
            key={child.id}
            node={child}
            onAddSub={onAddSub}
            onDelete={onDelete}
            onRename={onRename}
          />
        ))}
    </div>
  );
};

const ItemManager = () => {

  const [items, setItems] = useState([]);
  const [rootName, setRootName] = useState('');

  const fetchItems = async () => {
    const all = await getItems();
    setItems(all);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const refresh = async () => {
    const items = await getItems();
    setItems(buildItemTree(items));
  };

  useEffect(() => { refresh(); }, []);

  const handleAddRoot = async () => {
    if (!rootName) return;
    await addItem(rootName);
    setRootName('');
    fetchItems();
    // refresh();
  };

  const handleAddSub = async (parentId) => {
    const name = prompt('Enter sub item name:');
    if (!name) return;
    await addItem(name, parentId);
    fetchItems();
    // refresh();
  };

  const handleRename = async (id, newName) => {
    await updateItem(id, newName);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await deleteItem(id);
      fetchItems();
    }
  };

  const tree = buildItemTree(items);

  return (
    <div>
      <h2>Item Manager</h2>
      <input
        value={rootName}
        onChange={(e) => setRootName(e.target.value)}
        placeholder="New root items"
      />
      <button onClick={handleAddRoot}>Add Root</button>

      <div>
        {tree.map((item) => (
          <ItemNode
            key={item.id}
            node={item}
            onAddSub={handleAddSub}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemManager;
