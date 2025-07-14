import React, { useState, useRef, useEffect } from "react";

export default function IframePdfFlipViewer({ fileUrl }) {
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const totalPages = 10; // You need to know total pages or set manually

  const iframeRef = useRef();

  // Calculate iframe src with page and zoom params (works on PDF.js viewer or Google Docs viewer)
  // Basic embed example:
  const iframeSrc = `${fileUrl}#page=${page}&zoom=${zoom * 100}`;

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div style={{ width: "80vw", margin: "auto", textAlign: "center", userSelect: "none" }}>
      <div
        style={{
          border: "2px solid #444",
          borderRadius: 10,
          overflow: "hidden",
          width: "100%",
          height: "80vh",
          position: "relative",
          boxShadow: "0 0 20px rgba(0,0,0,0.15)",
          transition: "transform 0.5s ease",
          transformStyle: "preserve-3d",
          // simple page flip animation on page change
          transform: `rotateY(${(page - 1) * -180}deg)`
        }}
      >
        {/* The iframe with PDF */}
        <iframe
          ref={iframeRef}
          title="PDF Viewer"
          src={iframeSrc}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease",
            transformOrigin: "center center"
          }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={prevPage} disabled={page === 1} style={{ marginRight: 10 }}>
          Prev Page
        </button>
        <button onClick={nextPage} disabled={page === totalPages} style={{ marginRight: 10 }}>
          Next Page
        </button>
        <button onClick={zoomOut} style={{ marginRight: 10 }}>
          Zoom Out
        </button>
        <button onClick={zoomIn}>Zoom In</button>
      </div>

      <p style={{ marginTop: 10 }}>
        Page {page} / {totalPages} | Zoom: {(zoom * 100).toFixed(0)}%
      </p>
    </div>
  );
}
