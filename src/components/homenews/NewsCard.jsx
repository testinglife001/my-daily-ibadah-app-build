import React from 'react';
import { Link } from 'react-router-dom';
import './HomeNews.css';

const NewsCard = () => {
  return (
    <div className="bg-white shadow d-flex gap-2 p-3">
      <div className="position-relative overflow-hidden">
        <div className="news-thumb group-hover-scale position-relative">
          <img
            className="w-100 h-100 object-cover"
            src="https://cdn.wallpapersafari.com/30/62/jHBzTk.jpg"
            alt="thumb"
          />
          <div className="hover-overlay position-absolute w-100 h-100 start-0 top-0" />
        </div>
      </div>

      <div className="d-flex flex-column gap-1">
        <Link to="#" className="text-danger fw-semibold small">
          Sports
        </Link>

        <Link to="#" className="text-dark fw-semibold small hover-text-danger">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum iste rem excepturi facere eaque libero.
        </Link>

        <div className="d-flex gap-2 text-muted small">
          <span>October 06, 2025</span>
          <span>audwit</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
