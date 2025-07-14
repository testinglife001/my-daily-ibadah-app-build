/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// Use version that matches react-pdf
import HTMLFlipBook from 'react-pageflip';
import { db } from '../../firebase';
// import "react-pdf/styles.css"; // available in react-pdf v6+
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'; // ✅ Correct for Vite



// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;




export default function PdfFallbackViewer() {
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const snap = await getDoc(doc(db, 'books', docId));
      if (snap.exists()) {
        setPdfUrl(snap.data().pdfUrl);
      } else {
        alert('Book not found');
      }
    };
    fetchBook();
  }, [docId]);

  const handleToggle = () => setShowIframe(!showIframe);

  if (!pdfUrl) return <p>Loading PDF...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Book Viewer</h2>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleToggle}>
          Switch to {showIframe ? 'Flipbook' : 'Iframe'} View
        </button>
      </div>

      {showIframe ? (
        <iframe
          src={pdfUrl}
          title="PDF Iframe Viewer"
          width="100%"
          height="700px"
          style={{ border: '1px solid #ccc' }}
        />
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(err) => {
            console.error('PDF load error:', err.message || err);
            alert('Flipbook failed, try iframe view.');
            setShowIframe(true);
          }}
        >
          {numPages && (
            <HTMLFlipBook width={500} height={700}>
              {Array.from(new Array(numPages), (_, index) => (
                <div key={index}>
                  <Page pageNumber={index + 1} />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      )}
    </div>
  );
}
*/