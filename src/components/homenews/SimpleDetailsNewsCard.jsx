import React from 'react';
import { Link } from 'react-router-dom';
import './HomeNews.css';

const SimpleDetailsNewsCard = ({ type }) => {
  return (
    <div className="bg-white shadow">
      <div className="position-relative overflow-hidden">
        <div
          className={`group-hover-scale position-relative w-100 ${
            type === 'details-news' ? 'news-img-xl' : 'news-img-md'
          }`}
        >
          <img
            className="w-100 h-100 object-cover"
            src="https://cdn.wallpapersafari.com/30/62/jHBzTk.jpg"
            alt="news"
          />
          <Link
            to="#"
            className="hover-overlay position-absolute w-100 h-100 start-0 top-0"
          />
          <div className="position-absolute bottom-0 start-0 d-flex gap-2 text-white p-2">
            <div className="badge-custom">Travel</div>
            <div className="badge-custom">World</div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <Link
          to="#"
          className="text-dark fw-semibold d-block hover-text-danger small"
        >
          ABET accreditation reaffirms UTSA's
        </Link>
        <div className="d-flex gap-2 small text-muted mt-1">
          <span>October 06, 2025</span>
          <span>audwit</span>
        </div>

        {type === 'details-news' && (
          <p className="text-muted small pt-3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure optio
            tempore at iusto mollitia eveniet nesciunt beatae repellendus amet
            sit sapiente nostrum ratione, accusantium autem nemo nihil molestias
            libero cupiditate.
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleDetailsNewsCard;
