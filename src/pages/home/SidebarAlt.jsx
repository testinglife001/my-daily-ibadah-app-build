// src/components/SidebarAlt.jsx
import React from "react";

const SidebarAlt = () => {
  return (
    <div className="position-sticky" style={{ top: "2rem" }}>
      <div className="p-4 mb-3 bg-body-tertiary rounded">
        <h4 className="fst-italic">About</h4>
        <p className="mb-0">
          Write something about yourself, your content or blog topic here.
        </p>
      </div>

      <div className="p-4">
        <h4 className="fst-italic">Archives</h4>
        <ol className="list-unstyled mb-0">
          <li><a href="#">March 2024</a></li>
          <li><a href="#">February 2024</a></li>
          <li><a href="#">January 2024</a></li>
        </ol>
      </div>
    </div>
  );
};

export default SidebarAlt;
