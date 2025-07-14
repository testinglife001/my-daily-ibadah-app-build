// CustomPdfFlipbook.jsx with notes, bookmarks, audio recording, transcription, and sidebar view
import React, { useState, useRef, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CustomPdfFlipbook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [audios, setAudios] = useState({});
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visibleAudios, setVisibleAudios] = useState({});
  const containerRef = useRef();
  const touchStart = useRef(null);
  const flipSound = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const doublePageMode = true;
  const pageImages = Array.from({ length: 89 }, (_, i) => `/pdf/00-${String(i + 1).padStart(2, "0")}.png`);
  const totalPages = doublePageMode ? Math.ceil(pageImages.length / 2) : pageImages.length;
  const currentImageIndex = doublePageMode ? currentPage * 2 : currentPage;

  const toggleAudioVisibility = (page) => {
    setVisibleAudios((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
  };

  useEffect(() => {
    flipSound.current = new Audio("/sounds/flip.mp3");
    const last = localStorage.getItem("lastPage");
    if (last) setCurrentPage(parseInt(last));
  }, []);

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const docRef = doc(db, "annotations", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setNotes(data.notes || {});
        setBookmarks(data.bookmarks || []);
        setAudios(data.audios || {});
      }
    };
    loadData();
  }, [user]);

  const saveData = async (data) => {
    if (!user) return;
    await setDoc(doc(db, "annotations", user.uid), data, { merge: true });
  };

  const toggleBookmark = (page) => {
    const updated = bookmarks.includes(page) ? bookmarks.filter((p) => p !== page) : [...bookmarks, page];
    setBookmarks(updated);
    saveData({ bookmarks: updated });
  };

  const addNote = async (page) => {
    const text = prompt("Enter your note:", notes[page] || "");
    if (text != null) {
      const updated = { ...notes, [page]: text };
      setNotes(updated);
      saveData({ notes: updated });
    }
  };

  const transcribeAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
      body: formData,
    });

    const result = await response.json();
    return result.text || "";
  };

  const startRecording = async (page) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const fileRef = ref(storage, `audioNotes/${user.uid}/page-${page}.webm`);
      await uploadBytes(fileRef, blob);
      const url = await getDownloadURL(fileRef);
      const updated = { ...audios, [page]: url };
      setAudios(updated);
      saveData({ audios: updated });

      const transcript = await transcribeAudio(blob);
      if (transcript) {
        const newNotes = { ...notes, [page]: (notes[page] || "") + "\n" + transcript };
        setNotes(newNotes);
        saveData({ notes: newNotes });
      }
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const playSound = () => {
    flipSound.current?.play();
  };

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
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
      playSound();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      playSound();
    }
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
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage]);

  const renderPage = (index) => (
    <div className="page-wrapper" key={index} style={{ position: "relative" }}>
      <img src={pageImages[index]} alt={`Page ${index + 1}`} className="page-img" />
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <br /><br /><br />
        <button onClick={() => toggleBookmark(index)}>🔖</button>
        <button onClick={() => addNote(index)}>📝</button>
        {!recording ? (
          <button onClick={() => startRecording(index)}>🎙️</button>
        ) : (
          <button onClick={stopRecording}>⏹️</button>
        )}
        {audios[index] && (
          <div style={{ marginTop: 4, position: "relative", marginRight: '-30%', marginLeft: '15%' }}>
            <button
              onClick={() => toggleAudioVisibility(index)}
              style={{
                background: "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: 4,
                padding: "4px 8px",
                marginBottom: 4,
                cursor: "pointer"
              }}
            >
              {visibleAudios[index] ? "✖ Hide Audio" : "▶️ Show Audio"}
            </button>
            {visibleAudios[index] && (
              <audio controls src={audios[index]} style={{ width: "110%", marginLeft: '-40%' }} />
            )}
          </div>
        )}
      </div>
      <br /><br /><br />
      {bookmarks.includes(index) && <span style={{ marginTop: '80px', backgroundColor: 'gray', position: "absolute", top: 10, left: 10 }}>⭐</span>}
      {notes[index] && (
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "#ffffcc", padding: "4px 8px", borderRadius: 4, border: "1px solid #999", fontSize: 12, maxWidth: "95%" }}>
          {notes[index]}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      {sidebarOpen && (
        <div style={{ width: 240, background: "#111", color: "#eee", padding: 10, overflowY: "auto" }}>
          <h4>Bookmarks</h4>
          {bookmarks.map((p) => (
            <div key={p} onClick={() => setCurrentPage(doublePageMode ? Math.floor(p / 2) : p)} style={{ cursor: "pointer", padding: "4px 0", borderBottom: "1px solid #333" }}>📌 Page {p + 1}</div>
          ))}
          <h4 style={{ marginTop: 20 }}>Notes</h4>
          {Object.entries(notes).map(([p, t]) => (
            <div key={p} onClick={() => setCurrentPage(doublePageMode ? Math.floor(p / 2) : parseInt(p))} style={{ cursor: "pointer", padding: "4px 0" }}>
              <b>📝 Page {parseInt(p) + 1}</b>: <div style={{ fontSize: 12 }}>{t.slice(0, 100)}...</div>
            </div>
          ))}
        </div>
      )}

      <div ref={containerRef} style={{ width: isFullscreen ? "100vw" : 900, height: isFullscreen ? "100vh" : 500, margin: "auto", backgroundColor: "#222", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 30px #0008", display: "flex", flexDirection: "column", userSelect: "none" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", perspective: 1200, overflow: "hidden" }}>
            <div style={{ display: "flex", transform: `scale(${zoom})`, transition: "transform 0.3s ease", gap: "10px" }}>
              {renderPage(currentImageIndex)}
              {doublePageMode && pageImages[currentImageIndex + 1] && renderPage(currentImageIndex + 1)}
            </div>
          </div>

          <div className="thumbnails-vertical">
            {Array.from({ length: totalPages }).map((_, i) => {
              const index = i * 2;
              return (
                <img
                  key={i}
                  src={pageImages[index]}
                  alt={`Thumb ${i + 1}`}
                  onClick={() => setCurrentPage(i)}
                  className="thumb-img-vertical"
                  style={{ border: i === currentPage ? "2px solid #4caf50" : "2px solid transparent" }}
                />
              );
            })}
          </div>
        </div>

        <div className="controls">
          <div>
            <button onClick={prevPage} disabled={currentPage === 0}>◀ Prev</button>
            <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>Next ▶</button>
            <button onClick={zoomOut}>➖ Zoom</button>
            <button onClick={zoomIn}>➕ Zoom</button>
            <button onClick={toggleFullscreen}>{isFullscreen ? "🡼 Exit Fullscreen" : "⛶ Fullscreen"}</button>
            <button onClick={() => setSidebarOpen((o) => !o)}>{sidebarOpen ? "❌ Close Sidebar" : "📚 Sidebar"}</button>
          </div>
          <div>Page {currentPage + 1} / {totalPages}</div>
        </div>
      </div>

      <style>{`
        .page-wrapper { width: 400px; height: 540px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px #0006; }
        .page-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; }
        .controls { background: #111; color: #eee; padding: 10px 20px; display: flex; justify-content: space-between; font-family: sans-serif; }
        button { background: #222; border: 1px solid #555; color: #eee; padding: 5px 10px; margin: 0 5px; border-radius: 5px; cursor: pointer; }
        button:hover:not(:disabled) { background: #4caf50; }
        button:disabled { opacity: 0.3; cursor: default; }
        .thumbnails-vertical {
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          background: #111;
          padding: 10px;
          max-height: 100%;
        }
        .thumb-img-vertical {
          width: 80px;
          height: 100px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
