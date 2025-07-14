// src/components/PdfUploader.jsx
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
 // make sure db is exported from firebase.js

export default function PdfUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type !== 'application/pdf') {
      alert("Only PDF files are allowed");
      return;
    }
    setFile(selected);
  };

  const handleUpload = () => {
    if (!file || !title) {
      alert("Please select a file and enter a title.");
      return;
    }

    const storageRef = ref(storage, `books/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snap) => {
        const percent = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percent);
      },
      (err) => console.error(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const docRef = await addDoc(collection(db, 'books'), {
          title,
          pdfUrl: url,
          createdAt: Timestamp.now()
        });
        // navigate(`/view-pdf/${docRef.id}`);
        // navigate(`/view-pdf-react/${docRef.id}`);
        // navigate(`/view-pdf-webviewer/${docRef.id}`);
        // navigate(`/view-pdf-flipviewer/${docRef.id}`);
        // navigate(`/view-pdf-expressviewer/${docRef.id}`); 
        navigate(`/book-fallback/${docRef.id}`);
      }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload PDF Book</h2>
      <input className='m-2' type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br /><br />
      <input className='m-2' type="file" accept="application/pdf" onChange={handleFileChange} style={{ width: '100%' }} />
      <br/><br/>
      <button className='m-2' onClick={handleUpload} disabled={!file || !title} style={{ marginLeft: 10 }}>
        Upload & View
      </button>
      {progress > 0 && (
        <div style={{ marginTop: 10 }}>
          Upload: {Math.round(progress)}%
          <progress value={progress} max="100" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}
