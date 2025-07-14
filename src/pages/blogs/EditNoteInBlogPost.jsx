import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContext } from '../../apps/notesapp/notesappcomponents/EditorContext';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const EditNoteInBlogPost = () => {

    const { id } = useParams(); // note id
    const navigate = useNavigate();
    // const { initEditor, editorInstanceRef } = useContext(EditorContext);
    /* const  initEditor  = useContext(EditorContext);
    const updatedId = useRef(null)
    const editorInstanceRef = useContext(EditorContext);
    const editorRef = useRef(null); 
    const notesCollection = collection(db, "notes"); */

    const { initEditor, editorInstanceRef } = useContext(EditorContext);
    const updatedId = useRef(null);


    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    const editorInitialized = useRef(false);

    // 1. Initialize EditorJS once
    /* useEffect(() => {
        if (!editorInitialized.current) {
        initEditor(); // sets up EditorJS on #editorjs
        editorInitialized.current = true;
        }
    }, []); */

    useEffect(() => {
        if (!editorRef.current) {
            initEditor();
            editorRef.current = true;
        }
    }, []);

    // 2. Load note data from Firestore
    useEffect(() => {
        const fetchNote = async () => {
        const docRef = doc(db, "notes", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            const data = snapshot.data();
            setTitle(data.title);
            setCategory(data.category);

            // Wait for Editor to be ready and then load blocks
            const interval = setInterval(() => {
            if (editorInstanceRef.current?.isReady) {
                editorInstanceRef.current.render({ blocks: data.blocks || [] });
                clearInterval(interval);
            }
            }, 100);
        } else {
            alert("Note not found.");
            navigate(-1);
        }
        };
        fetchNote();
    }, [id]);

    // 3. Update Note
    const handleUpdate = async () => {
        const data = await editorInstanceRef.current.save();

        if (data.blocks.length === 0) return alert("Cannot save empty note.");

        const noteRef = doc(db, "notes", id);
        await updateDoc(noteRef, {
        title,
        category,
        blocks: data.blocks,
        updatedAt: new Date(),
        });

        alert("Note updated!");
        navigate(-1); // Go back
    };

  return (
    <div>
        <div className="container mt-4">
      <h4>Edit Note</h4>

      <input
        type="text"
        placeholder="Title"
        className="form-control my-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        className="form-control my-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div id="editorjs" className="my-3" />

      <button onClick={handleUpdate} className="btn btn-success">
        Update Note
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary ms-2">
        Cancel
      </button>
    </div>
    </div>
  )
}

export default EditNoteInBlogPost