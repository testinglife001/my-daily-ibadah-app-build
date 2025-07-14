// DynamicImageFlipbook.jsx (with notes, bookmarks, highlights)
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function DynamicImageFlipbook() {
  const [pageImages, setPageImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState({});
  const [doublePageMode, setDoublePageMode] = useState(true);
  const containerRef = useRef();
  const touchStart = useRef(null);
  const observer = useRef();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const maxPages = 89;
    let foundPages = [];
    let loaded = 0;

    for (let i = 1; i <= maxPages; i++) {
      const formattedNum = i.toString().padStart(2, "0");
      const url = `/pdf/00-${formattedNum}.png`;
      const img = new Image();
      img.src = url;

      img.onload = () => {
        foundPages.push(url);
        loaded++;
        if (loaded === maxPages) setPageImages(foundPages);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === maxPages) setPageImages(foundPages);
      };
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      const userDoc = doc(db, "annotations", user.uid);
      const snap = await getDoc(userDoc);
      if (snap.exists()) {
        const data = snap.data();
        setBookmarks(data.bookmarks || []);
        setNotes(data.notes || {});
      }
    };
    fetchNotes();
  }, [user]);

  const saveData = async (newBookmarks, newNotes) => {
    if (!user) return;
    const userDoc = doc(db, "annotations", user.uid);
    await setDoc(
      userDoc,
      {
        bookmarks: newBookmarks,
        notes: newNotes,
      },
      { merge: true }
    );
  };

  const toggleBookmark = (pageIndex) => {
    const updated = bookmarks.includes(pageIndex)
      ? bookmarks.filter((b) => b !== pageIndex)
      : [...bookmarks, pageIndex];
    setBookmarks(updated);
    saveData(updated, notes);
  };

  const addNote = (pageIndex) => {
    const note = prompt("Enter your note for this page:", notes[pageIndex] || "");
    if (note !== null) {
      const updated = { ...notes, [pageIndex]: note };
      setNotes(updated);
      saveData(bookmarks, updated);
    }
  };

  const totalPages = doublePageMode
    ? Math.ceil(pageImages.length / 2)
    : pageImages.length;

  const currentImageIndex = doublePageMode ? currentPage * 2 : currentPage;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.current;
    if (deltaX > 50) prevPage();
    else if (deltaX < -50) nextPage();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      else if (e.key === "ArrowLeft") prevPage();
      else if (e.key === "+") zoomIn();
      else if (e.key === "-") zoomOut();
      else if (e.key === "f") toggleFullscreen();
      else if (e.key === "d") setDoublePageMode((m) => !m);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage]);

  if (pageImages.length === 0) return <p>Loading pages...</p>;

  const renderPage = (pageIndex) => (
    <div
      key={pageIndex}
      className="page-wrapper"
      style={{ position: "relative" }}
    >
      <img
        src={pageImages[pageIndex]}
        alt={`Page ${pageIndex + 1}`}
        className="page-img"
        loading="lazy"
      />
      {bookmarks.includes(pageIndex) && (
        <span
          style={{
            marginTop: '65px',
            position: "absolute",
            top: 8,
            left: 8,
            // background: "#ffc",
            background: 'black',
            padding: "2px 5px",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          ⭐
        </span>
      )}
      {notes[pageIndex] && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(255,255,200,0.9)",
            color: "#222",
            padding: "5px 10px",
            borderRadius: 6,
            fontSize: 12,
            maxWidth: "90%",
          }}
        >
          📝 {notes[pageIndex]}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <br/><br/>
        <button onClick={() => toggleBookmark(pageIndex)}>🔖</button>
        <button onClick={() => addNote(pageIndex)}>📝</button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{
         width: isFullscreen ? "100vw" : 900,
        // width: '100%',
        height: isFullscreen ? "100vh" : 600,
        margin: "auto",
        backgroundColor: "#222",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 0 30px #0008",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      <div
        style={{
          flex: 1,
          perspective: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease",
            gap: "10px",
          }}
        >
          {renderPage(currentImageIndex)}
          {doublePageMode &&
            pageImages[currentImageIndex + 1] &&
            renderPage(currentImageIndex + 1)}
        </div>
      </div>

      <div className="controls">
        <div>
          <button onClick={prevPage} disabled={currentPage === 0}>◀ Prev</button>
          <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>Next ▶</button>
          <button onClick={zoomOut}>➖ Zoom</button>
          <button onClick={zoomIn}>➕ Zoom</button>
          <button onClick={toggleFullscreen}>{isFullscreen ? "🡼 Exit Fullscreen" : "⛶ Fullscreen"}</button>
          <button onClick={() => setDoublePageMode((m) => !m)}>{doublePageMode ? "🔳 Single Page" : "📖 Double Page"}</button>
        </div>
        <div>
          Page {currentPage + 1} / {totalPages} | Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      <div className="thumbnails">
        {Array.from({ length: totalPages }).map((_, i) => {
          const index = i * (doublePageMode ? 2 : 1);
          return (
            <img
              key={i}
              src={pageImages[index]}
              alt={`Thumb ${i + 1}`}
              onClick={() => setCurrentPage(i)}
              className="thumb-img"
              loading="lazy"
              style={{ border: i === currentPage ? "2px solid #4caf50" : "2px solid transparent" }}
            />
          );
        })}
      </div>

      <style>{`
        .page-wrapper {
          width: 400px;
          height: 540px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px #0006;
        }
        .page-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }
        .controls {
          background: #111;
          color: #eee;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
        }
        .thumbnails {
          background: #111;
          padding: 10px;
          display: flex;
          overflow-x: auto;
          gap: 6px;
        }
        .thumb-img {
          width: 60px;
          height: 80px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 4px;
        }
        button {
          background: #222;
          border: 1px solid #555;
          color: #eee;
          padding: 5px 10px;
          margin: 0 5px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover:not(:disabled) {
          background: #4caf50;
        }
        button:disabled {
          opacity: 0.3;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
