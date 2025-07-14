import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { EditorContext } from '../../apps/notesapp/notesappcomponents/EditorContext';

const AddNoteBlogPost = ({blogpostId,user}) => {
    
    const [title, setTitle] = useState("");
    const [ntitle, setNTitle] = useState("");
    const [category, setCategory] = useState("");
    const [notesArr, setNotesArr] = useState([]);
    
    const { initEditor } = useContext(EditorContext);
    const updatedId = useRef(null)
    const {editorInstanceRef} = useContext(EditorContext)
    const editorRef = useRef(null);
    const notesCollection = collection(db, "notes");
    
    // console.log(blogpostId);

    // const { id } = useParams();
    const { noteId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!editorRef.current) {
          initEditor();
          editorRef.current = true;
        }
    }, []);
    
    
    useEffect(() => {
        const fetchBlog = async () => {
            const docRef = doc(db, "blogposts", blogpostId);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) setTitle(snapshot.data().title);
            if (snapshot.exists()) {
            const data = snapshot.data();
            } else {
            // toast.error("Blog not found");
            console.log("Blog not found");
            }
        };
        fetchBlog();
    }, [blogpostId]);

    // console.log(blogpostId);
    // console.log(title);

    const fetchNotes = async () => {
        const snapshot = await getDocs(notesCollection);
        const notes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNotesArr(notes.reverse()); // reverse to show latest first
    };

    // ✅ Fetch note data if editing an existing note (via noteId param)
    useEffect(() => {        
      const loadNote = async () => {
        if (!noteId) return;
        const noteRef = doc(db, "notes", noteId);
        const snapshot = await getDoc(noteRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setNTitle(data.title);
          setCategory(data.category);

          // Wait until editor is ready before rendering blocks
          const interval = setInterval(() => {
            if (editorInstanceRef.current?.isReady) {
              editorInstanceRef.current.render({ blocks: data.blocks || [] });
              clearInterval(interval);
            }
          }, 100);
        } else {
          console.log("Note not found.");
          navigate(-1); // Go back
        }
      };
 
      loadNote();
      
    }, [noteId]);

   

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSave = async () => {
        const data = await editorInstanceRef.current.save();
        // const savedData = await editorRef.current.save();
        const savedData = await editorInstanceRef.current.save();

        if (data.blocks.length === 0) return;

        // const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to save notes.");
            return;
        }

        if (updatedId.current) {
            const noteRef = doc(db, "notes", updatedId.current);
            await updateDoc(noteRef, {
            title,
            category,
            blocks: data.blocks,
            isPublic: false,
            updatedAt: new Date(),
            createdBy: user.uid, // or user.email
            createdUsername: user.displayName || "",
            });
            updatedId.current = null;
            console.log("Note updated!");
        } else {
            await addDoc(notesCollection, {
            title,
            category:'blogpost',
            blocks: data.blocks,
            isPublic: false,
            createdAt: new Date(),
            createdBy: user.uid, // or user.email
            createdUsername: user.displayName || "",
            });
            console.log("Note saved!");
        }

    fetchNotes(); // Refresh list
    };

  return (
    <div className='container' >
        <div className="container-fluid">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title fs-5" >Add Note for Blog Post</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="card-body">
            {/* Title and Category Inputs */}
            <input
              type="text"
              placeholder={"Blog Title" || "Note Title"}
              className="form-control mb-3"
              value={title || ntitle}
              onChange={(e) => setTitle(e.target.value) || setNTitle(e.target.value)}
            />
            {/* <input
              type="text"
              placeholder="Note Title"
              className="form-control mb-3"
              value={ntitle}
              onChange={(e) => setNTitle(e.target.value)}
            /> */}
            <input
              type="text"
              placeholder="Category"
              className="form-control mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {/* EditorJS Holder */}
            <div id="editorjs"></div>
          </div>
          <div className="text-center card-footer">
            <button type="button" className="btn btn-secondary" >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
               onClick={handleSave}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNoteBlogPost