/*
import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PdfExpressViewer() {
  const viewerRef = useRef(null);
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async () => {
      const snap = await getDoc(doc(db, 'books', docId));
      if (snap.exists()) setPdfUrl(snap.data().pdfUrl);
    };
    fetchPdf();
  }, [docId]);

  useEffect(() => {
    if (!pdfUrl) return;
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: pdfUrl,
        licenseKey: '', // Free version allows 5 docs/day
      },
      viewerRef.current
    ).then((instance) => {
      // You can customize toolbar here
    });
  }, [pdfUrl]);

  return (
    <div style={{ height: '100vh' }} ref={viewerRef}></div>
  );
  */
