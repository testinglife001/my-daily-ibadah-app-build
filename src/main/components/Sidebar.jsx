// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";



 function Sidebar() {
  return (
    <aside className="sidebar-sticky p-3">
      <section className="sidebar-box mb-4">
        <h5 className="sidebar-title">📌 About</h5>
        <p className="sidebar-text">
          Welcome to our blog! We share tech insights, tutorials, and trending topics weekly.
        </p>
      </section>

      <section className="sidebar-box mb-4">
        <h5 className="sidebar-title">📚 Archives</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">March 2025</a></li>
          <li><a href="#">February 2025</a></li>
          <li><a href="#">January 2025</a></li>
        </ul>
      </section>

      <section className="sidebar-box">
        <h5 className="sidebar-title">🌐 Elsewhere</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Facebook</a></li>
        </ul>
      </section>
    </aside>
  );
}


export default  Sidebar;
