import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <>
      <h5 className="mb-3">📚 Categories</h5>
      <ListGroup className="mb-4">
        <ListGroup.Item>Politics</ListGroup.Item>
        <ListGroup.Item>Business</ListGroup.Item>
        <ListGroup.Item>Tech</ListGroup.Item>
        <ListGroup.Item>Sports</ListGroup.Item>
      </ListGroup>

      <h5 className="mb-3">🔥 Popular</h5>
      <ul className="list-unstyled">
        <li>🗞️ Big Tech Merger</li>
        <li>🌍 Climate Pact</li>
        <li>📉 Market Shakeup</li>
      </ul>

      <h5 className="mb-3 mt-4">🎯 Sponsored</h5>
      <img src="/images/ad-banner.jpg" alt="Ad" className="img-fluid" />
    </>
  );
};

export default Sidebar;
