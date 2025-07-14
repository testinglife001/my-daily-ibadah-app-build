import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import EditorContextProvider, { EditorContext } from '../../apps/notesapp/notesappcomponents/EditorContext';
import { auth, db } from '../../firebase';


const AddPostNote = ({postId,user}) => {

    const [title, setTitle] = useState("");
     const [id, setId] = useState('');
    const [ntitle, setNTitle] = useState("");
    const [category, setCategory] = useState("");
    const [notesArr, setNotesArr] = useState([]);
    

    const { initEditor } = useContext(EditorContext);
    const updatedId = useRef(null);
    const {editorInstanceRef} = useContext(EditorContext);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            initEditor();
            editorRef.current = true;
        }
    }, []);

    const notesCollection = collection(db, "notes");

     const { noteId } = useParams();
    // const { id: postId, noteId } = useParams(); // ✅ use here
    const navigate = useNavigate();
    // console.log(id);
    // console.log(postId);

    
    
    useEffect(() => {
      if (!postId) return; // guard if undefined
        const fetchPost = async () => {
            const docRef = doc(db, "posts", postId);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) setTitle(snapshot.data().title);
            if (snapshot.exists()) {
            const data = snapshot.data();
            setId(snapshot.data().id)
            } else {
            // toast.error("Blog not found");
            console.log("Post not found");
            }
        };
        fetchPost();
    }, [postId]);

    // console.log(blogpostId);
    console.log(id);
    console.log(postId);
    console.log(title);

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
          setTitle(data.title);
          setCategory(data.category);

          updatedId.current = noteId; // Set updatedId here

          // Render editor blocks
          const interval = setInterval(() => {
            if (editorInstanceRef.current?.isReady) {
              editorInstanceRef.current.render({ blocks: data.blocks || [] });
              clearInterval(interval);
            }
          }, 100);
        } else {
          console.log("Note not found.");
          navigate(-1);
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
        // const savedData = await editorInstanceRef.current.save();

        if (data.blocks.length === 0) {
            alert("Cannot save empty note.");
            return;
        }

        // const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to save notes.");
            return;
        }


        // handleSave update part
        if(noteId){
          if (updatedId.current && typeof updatedId.current === 'string') {
            const noteRef = doc(db, "notes", updatedId.current);
            await updateDoc(noteRef, {
              title,
              category,
              blocks: data.blocks,
              isPublic: false,
              updatedAt: new Date(),
              createdBy: user.uid,
              createdUsername: user.displayName || "",
            });
            updatedId.current = null;
            console.log("Note updated!");
          }
        } else {
            if (!postId) {
                console.warn("⚠️ postId is undefined — saving categoryTypeId as null");
            }

            await addDoc(notesCollection, {
                title,
                category: 'post',
                categoryTypeId: postId ?? null, // ✅ convert undefined to null
                blocks: data.blocks,
                isPublic: false,
                createdAt: new Date(),
                createdBy: user.uid,
                createdUsername: user.displayName || "",
            });

            console.log("Note saved!");
        }

    fetchNotes(); // Refresh list
    };

  return (
    


    <div>
        
        <div className="container-fluid">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title fs-5" >Note for Post</h1>
            <h5>{noteId ? "Edit Note" : "Create New Note"} for Post</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="card-body">
            {/* Title and Category Inputs */}
            <input
              type="text"
              placeholder={"Post Title" || "Note Title"}
              className="form-control mb-3"
              value={title || ntitle}
              onChange={(e) => setTitle(e.target.value)}
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
              value={category || 'Post'}
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

export default AddPostNote