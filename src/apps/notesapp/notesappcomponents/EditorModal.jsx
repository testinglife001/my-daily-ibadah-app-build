// EditorModal.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../../firebase";
// import Autocomplete from '@mui/lab/Autocomplete';
// import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete'; // ✅ Correct
import TextField from '@mui/material/TextField';
// import { collection, getDocs } from "firebase/firestore";
import { EditorContext } from "./EditorContext";
import { getUserDisplayName } from "../../../utils/getUserDisplayName";
// import { getUserDisplayName } from './utils'; // fetch user displayName by UID

// function EditorModal({ onSave}) {
// function EditorModal({ onSave, initialTitle = "", initialCategory = "", initialBlocks = [] }) {
const EditorModal = ({ show, handleClose, onSave, initialTitle, initialCategory, initialIsPublic = false, initialBlocks = [] }) => {
  const { initEditor } = useContext(EditorContext);
  const editorRef = useRef(null);

  const [title, setTitle] = useState(initialTitle || "");
  const [category, setCategory] = useState(initialCategory || "");
  const [isPublic, setIsPublic] = useState(false);
  const [shareUid, setShareUid] = useState("");
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  
  // Fetch all users
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setAllUsers(snap.docs.map(d => d.data()));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      const snapshot = await getDocs(collection(db, "category-types"));
      const options = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategoryOptions(options);
    };
    fetchCategoryTypes();
  }, []);


  useEffect(() => {
    setTitle(initialTitle || "");
    setCategory(initialCategory || "");
  }, [initialTitle, initialCategory]);

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
      editorRef.current = true;
    }
  }, []);

  const handleSave = () => {
    onSave(title, category, isPublic);
    setTitle("");
    setCategory("");
  };

  const shareNote = async (note) => {
    const recipientUid = shareUid; // selected UID
    if (!recipientUid) return;

    await addDoc(collection(db, "notes"), {
      ...note,
      createdBy: recipientUid,
      createdUsername: getDisplayName(recipientUid),
      sharedOriginal: note.id,
      isPublic: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      sharedWith: [], // receiver doesn't auto-share
    });
  };

  const shareNoteHandler = async () => {
    if (!shareUid) return;
    const uidToShareWith = shareUid; // or wherever you're storing the UID
    const name = await getUserDisplayName(uidToShareWith);

    if (name) {
      console.log(`Sharing with ${name} (${uidToShareWith})`);
      // Add to sharedWith, update note, or show a toast
      await shareNote({
      id: updatedId.current,
      title,
      categoryType: category,
      blocks: await editorInstanceRef.current.save().then(d => d.blocks),
      createdBy: auth.currentUser.uid,
      createdByUsername: auth.currentUser.displayName,
    });
    alert("Shared with user!");
    } else {
      alert("Invalid UID or user not found.");
    }
    
  };
  
    

  return (
    <div
      className="modal fade modal-lg"
      id="editormodal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="editormodalLabel"
      aria-hidden="true"
    >
    {/*<div
        className={`modal modal-lg fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="editormodalLabel"
        aria-hidden={!show}
        style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      >*/}
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-lg-down">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="editormodalLabel">Editor Modal</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            {/*<button type="button" className="btn-close" onClick={handleClose}></button>*/}

          </div>
          <div className="modal-body">
            {/* Title and Category Inputs */}
            <input
              type="text"
              placeholder="Title"
              className="form-control mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br/>
            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category Type</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            {/* In render, before modal footer: */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label">Make Public</label>
            </div>

            <br/>
            EditorJS Holder
             <br/> <br/>
            {/* EditorJS Holder */}
            <div id="editorjs"></div>
            
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
               onClick={handleSave}
              // onClick={() => onSave(title, category, isPublic, shareUid)}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorModal;
