// src/components/PdfViewerReact.jsx
/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import PDFViewer from 'pdf-viewer-reactjs';

export default function PdfViewerReact() {
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

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
    <div style={{ height: '100vh' }}>
      <PDFViewer
        document={{ url: pdfUrl }}
        css="custom-pdf-viewer"
        navbarOnTop
        hideRotation
      />
    </div>
  );
}
  */
