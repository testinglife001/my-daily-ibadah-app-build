import React from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarWidgets.css";

const FeatureBlogs = ({ blogs }) => {
  const navigate = useNavigate();
  return (
    <div className="featured-blogs">
      {blogs?.slice(0, 4).map((item) => (
        <div
          key={item.id}
          className="featured-blog-item d-flex mb-3 cursor-pointer"
          onClick={() => navigate(`/detail/${item.id}`)}
        >
          <img
            src={item.imgUrl}
            alt={item.title}
            className="img-thumbnail me-2"
            style={{ width: "80px", height: "60px", objectFit: "cover" }}
          />
          <div>
            <div className="fw-semibold small text-truncate">{item.title}</div>
            <div className="text-muted small">
              {item.timestamp.toDate().toDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureBlogs;
