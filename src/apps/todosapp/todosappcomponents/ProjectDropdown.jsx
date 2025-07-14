// ProjectDropdown.jsx
import React from 'react';

const ProjectDropdown = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <select
      className="form-select"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.title}</option>
      ))}
    </select>
  );
};

export default ProjectDropdown;