import { useContext, useEffect, useRef, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { EditorContext } from "./EditorContext";
import { getUserDisplayName } from "../../../utils/getUserDisplayName";

const EditorModalAlt = ({
  show,
  handleClose,
  onSave,
  initialTitle = "",
  initialCategory = "",
}) => {
  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(null);

  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUid, setShareUid] = useState("");
  const [selectedUserUid, setSelectedUserUid] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch category options
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

  // Fetch all users for sharing
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setAllUsers(snap.docs.map((doc) => doc.data()));
    };
    fetchUsers();
  }, []);

  // Set values on open
  useEffect(() => {
    setTitle(initialTitle);
    setCategory(initialCategory);
  }, [initialTitle, initialCategory]);

  // Initialize EditorJS once
  useEffect(() => {
    if (!editorRef.current && document.getElementById("editorjs")) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  const handleSaveNote = () => {
    if (!title.trim()) return alert("Title is required.");
    onSave(title, category, isPublic, shareUid);
    setTitle("");
    setCategory("");
    setIsPublic(false);
    setShareUid("");
    handleClose();
  };

  const shareNote = async (note) => {
    if (!selectedUserUid) return alert("No user selected to share with.");

    await addDoc(collection(db, "notes"), {
      ...note,
      createdBy: selectedUserUid,
      createdUsername: await getUserDisplayName(selectedUserUid),
      sharedOriginal: note.id,
      isPublic: false,
      sharedWith: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    alert("Note shared successfully!");
  };

  const shareNoteHandler = async () => {
    if (!selectedUserUid || !editorInstanceRef.current) return;
    const blocks = await editorInstanceRef.current.save().then((d) => d.blocks);

    const note = {
      id: `temp-${Date.now()}`,
      title,
      categoryType: category,
      blocks,
      createdBy: auth.currentUser?.uid || "unknown",
      createdByUsername: auth.currentUser?.displayName || "Anonymous",
    };

    await shareNote(note);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Note</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          <div className="modal-body">
            <input
              type="text"
              placeholder="Note title"
              className="form-control mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label">Make this note public</label>
            </div>

            <Autocomplete
              options={allUsers}
              getOptionLabel={(option) => option.displayName || option.uid}
              onChange={(e, value) => setSelectedUserUid(value?.uid || "")}
              renderInput={(params) => (
                <TextField {...params} label="Share a copy with user" variant="outlined" />
              )}
            />
            <button
              type="button"
              className="btn btn-outline-secondary my-2"
              onClick={shareNoteHandler}
            >
              Share a Copy
            </button>

            <div id="editorjs" className="border rounded p-2" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveNote}>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorModalAlt;
