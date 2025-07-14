// src/components/HeaderImgAlt.jsx
import React from "react";
import "./HeaderImgAlt.css"; // optional custom styling

const HeaderImgAlt = () => {
  return (
    <div className="header-container mb-4">
      <img
        className="img-fluid w-100"
        src="https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        alt="Header"
        style={{ maxHeight: "450px", objectFit: "cover" }}
      />
    </div>
  );
};

export default HeaderImgAlt;
