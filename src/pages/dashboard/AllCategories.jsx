// src/components/AllCategories.jsx
import React from "react";
import SubscribeButton from "./SubscribeButton"; // import the button

const categories = ["Tech", "Science", "Business", "Sports", "Health", "Culture"];

const AllCategories = ({ user }) => {
  return (
    <div className="container mt-4">
      <h4>All Categories</h4>
      <ul className="list-group">
        {categories.map((category, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {category}
            <SubscribeButton user={user} categoryName={category} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCategories;
