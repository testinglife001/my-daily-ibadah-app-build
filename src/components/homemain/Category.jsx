import React from "react";
import { Link } from "react-router-dom";
import "./SidebarWidgets.css";

const Category = ({ catgBlogsCount }) => {
 

  return (
    <ul className="list-unstyled category-list">
      {catgBlogsCount?.map((item, index) => (
        <li key={index} className="category-item">
          <Link to={`/category/${item.id}`} >
            {item.category}
            <span className="count ms-1">({item.count})</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Category;
