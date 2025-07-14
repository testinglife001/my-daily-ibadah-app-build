/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function FlipPdfViewer() {
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const snap = await getDoc(doc(db, 'books', docId));
      if (snap.exists()) setPdfUrl(snap.data().pdfUrl);
      else alert('Book not found');
    };
    fetchBook();
  }, [docId]);

  if (!pdfUrl) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Flipbook PDF Viewer</h2>
      <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        <HTMLFlipBook width={500} height={700}>
          {Array.from(new Array(numPages), (_, index) => (
            <div key={index}>
              <Page pageNumber={index + 1} />
            </div>
          ))}
        </HTMLFlipBook>
      </Document>
    </div>
  );
}
  */
