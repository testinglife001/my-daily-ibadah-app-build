import React from "react";
import { Link } from "react-router-dom";

export default function FloatingGuideButton() {
  return (
    <Link
      to="/app-tour"
      className="floating-guide-btn"
      aria-label="Open app tour"
      title="Open App Tour"
    >
      App Tour
    </Link>
  );
}
