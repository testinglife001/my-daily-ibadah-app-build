import React from 'react';
import { Link } from 'react-router-dom';
import './HomeNews.css';

const CarouselNewsCard = ({ item, title, type }) => {
  return (
    <div className="group position-relative">
      <div className="overflow-hidden">
        <div
          className={`position-relative w-100 group-hover-scale ${
            type === 'latest' ? 'news-img-lg' : 'news-img-md'
          }`}
        >
          <img
            className="w-100 h-100 object-cover"
            src={item}
            alt={title}
          />
        </div>
      </div>

      <Link
        to="#"
        className="hover-overlay position-absolute w-100 h-100 start-0 top-0"
      />

      <div className="position-absolute bottom-0 start-0 p-3 text-white d-flex flex-column gap-2">
        <div className="badge-custom">{type}</div>
        <h2 className="fs-5 fw-semibold">{title}</h2>
        <div className="d-flex gap-2 small fw-normal">
          <span>October 06, 2025</span>
          <span>audwit</span>
        </div>
      </div>
    </div>
  );
};

export default CarouselNewsCard;
