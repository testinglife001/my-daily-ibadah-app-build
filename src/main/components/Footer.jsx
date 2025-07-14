// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="text-center py-4 mt-5 border-top bg-light text-muted">
      <p className="mb-1">
        © {new Date().getFullYear()} My Blog. Built with <a href="https://getbootstrap.com/">Bootstrap</a>.
      </p>
      <a href="#" className="text-primary text-decoration-none">Back to top</a>
    </footer>
  );
}
