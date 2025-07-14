// src/components/PdfViewerWebViewer.jsx
/*
import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PdfViewerWebViewer() {
  const viewerRef = useRef(null);
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'books', docId));
      if (snap.exists()) setPdfUrl(snap.data().pdfUrl);
    })();
  }, [docId]);

  useEffect(() => {
    if (!pdfUrl) return;

    WebViewer(
      {
        path: '/webviewer/lib', // 👈 must copy /lib from WebViewer SDK to public folder
        initialDoc: pdfUrl,
        licenseKey: 'YOUR_LICENSE_KEY', // for production
      },
      viewerRef.current
    ).then((instance) => {
      // You can customize toolbar here
    });
  }, [pdfUrl]);

  return <div style={{ height: '100vh' }} ref={viewerRef}></div>;
}
  */
