// src/components/CategorySidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './CategorySidebar.css';

export default function CategorySidebar({ categories, subcategories, counts }) {
  const [openIds, setOpenIds] = useState([]);
  const navigate = useNavigate();

  const toggleOpen = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Helper to get count from counts map
  const getCount = (id) => counts[id] || 0;

  

  return (
    <div className="category-sidebar bg-light">
      <h5 className="mb-3">📂 Categories</h5>
      <ul className="list-unstyled">
        {categories.map(cat => (
          <li key={cat.id} className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-link p-0"
                onClick={() => toggleOpen(cat.id)}
                aria-label={openIds.includes(cat.id) ? "Collapse" : "Expand"}
              >
                {openIds.includes(cat.id) ? "−" : "+"}
              </button>
              <Link
                to={`/category/${cat.id}`}
                className="ms-2 flex-grow-1 text-decoration-none"
              >
                {cat.name} <small className="text-muted">({getCount(cat.id)})</small>
              </Link>
            </div>

            {openIds.includes(cat.id) && (
              <ul className="list-unstyled ps-4 mt-2">
                {subcategories
                  .filter(sub => sub.parentId === cat.id)
                  .map(subcat => (
                    <li key={subcat.id} className="mb-1">
                      <Link to={`/category/${subcat.id}`} className="text-decoration-none">
                        {subcat.name} <small className="text-muted">({getCount(subcat.id)})</small>
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
