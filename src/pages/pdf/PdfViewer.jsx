import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PdfViewer() {
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const docRef = doc(db, 'books', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPdfUrl(data.pdfUrl);
          setTitle(data.title || 'View Book');
        } else {
          alert('Book not found');
        }
      } catch (err) {
        console.error('Error fetching book:', err.message);
      }
    };

    fetchPdfUrl();
  }, [docId]);

  if (!pdfUrl) return <p>Loading PDF...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{title}</h2>
      <iframe
        title="PDF Viewer"
        src={pdfUrl}
        // src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        width="100%"
        height="600px"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
}
