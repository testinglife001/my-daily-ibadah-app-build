import { useContext, useEffect, useRef, useState } from "react"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, getDoc, orderBy, limit } from "firebase/firestore";
import Masonry from "react-masonry-css"
import { nanoid } from "nanoid";
import EditorModal from "./EditorModal";
import Card from "./Card";
import { EditorContext } from "./EditorContext";
import { auth, db } from "../../../firebase";
import ShareModal from "./ShareModal";
import CardAlt from "./CardAlt";
import { Button } from "react-bootstrap";






function Notes({user}) {

    const [notesArr, setNotesArr] = useState([]);
    const [filter, setFilter] = useState({ text: "", category: "", type: "all" });
    const [categoryOptions, setCategoryOptions] = useState([]); 
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareNoteId, setShareNoteId] = useState(null);
    const [showModal, setShowModal] = useState(false); // Add this at top with other states
    const [viewType, setViewType] = useState("grid"); // or 'list'
    const [modalData, setModalData] = useState({
        title: "",
        category: "",
        isPublic: false,
        blocks: [],
    });
    const notesCollection = collection(db, "notes");
    const updatedId = useRef(null)
    const {editorInstanceRef} = useContext(EditorContext)

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

    // FETCH NOTES (own + shared copies)
    const fetchAllNotes = async () => {
      if (!user) return;

      const qOwn = query(notesCollection, where("createdBy", "==", user.uid));
      const qShared = query(notesCollection, where("sharedOriginal", "!=", null), where("createdBy", "==", user.uid));
      const qPublic = query(notesCollection, where("isPublic", "==", true));
      const qSharedWithMe = query(notesCollection, where("sharedWith", "array-contains", user.uid));

      const [snapOwn, snapShared, snapPublic, snapSharedWithMe] = await Promise.all([
        getDocs(qOwn),
        getDocs(qShared),
        getDocs(qPublic),
        getDocs(qSharedWithMe),
      ]);

      const combined = [
        ...snapOwn.docs,
        ...snapShared.docs,
        ...snapPublic.docs,
        ...snapSharedWithMe.docs,
      ];

      // Use a Map to deduplicate by document ID
      const dedupedMap = new Map();
      combined.forEach((docSnap) => {
        dedupedMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });

      const notes = Array.from(dedupedMap.values()).reverse();
      setNotesArr(notes);
    };

    useEffect(() => {
      fetchAllNotes();
    }, [user]);      
    
  const filtered = notesArr.filter((note) => {
      const matchCategory = !filter.category || note.categoryType === filter.category;
      const matchText = !filter.text || note.title.toLowerCase().includes(filter.text.toLowerCase());

      const isOwn = note.createdBy === user.uid && !note.sharedOriginal;
      const isSharedCopy = note.createdBy === user.uid && note.sharedOriginal;
      const isSharedWithMe = note.sharedWith?.includes(user.uid);
      const isPublic = note.isPublic;

      let matchType = true;
      if (filter.type === "own") matchType = isOwn;
      else if (filter.type === "shared") matchType = isSharedCopy;
      else if (filter.type === "public") matchType = isPublic;
      else if (filter.type === "sharedwithme") matchType = isSharedWithMe;

      return matchCategory && matchText && matchType;
  });


    const handleSave = async (title, category, isPublic) => {
      const data = await editorInstanceRef.current.save();
      if (data.blocks.length === 0) return;
      if (!user) {
          alert("You must be logged in to save notes.");
          return;
      }
      if (updatedId.current) {
          const noteRef = doc(db, "notes", updatedId.current);
          await updateDoc(noteRef, {
            title,
            categoryType: category,
            isPublic,
            blocks: data.blocks,
            updatedAt: serverTimestamp(),
          });
          updatedId.current = null;
      } else {
          await addDoc(notesCollection, {
          title,
          categoryType: category,
          blocks: data.blocks,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          createdUsername: user.displayName || "",
          isPublic,
          sharedOriginal: null,
          sharedWith: [],
          });
          console.log("Note saved!");
      }
      fetchAllNotes(); // Refresh list
    };

    const handleAdd = () => {
        updatedId.current = null;
        editorInstanceRef.current.clear();
        setModalData({ title: "", categoryType: "", blocks: [] });
        setShowModal(true);
    }

    const handleEdit = async (id) => {
      updatedId.current = id;
      const note = notesArr.find((note) => note.id === id);
      if (note) {
        editorInstanceRef.current.render({ blocks: note.blocks });
      }
      try {
        const docRef = doc(db, "notes", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const note = snap.data();
          setModalData({
            title: note.title || "",
            categoryType: note.categoryType || "",
            isPublic: note.isPublic || false,
          });
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error loading note:", err);
      }
    };

    // Delete note by ID
    const handleDelete = async (id) => {
        const noteRef = doc(db, "notes", id);
        await deleteDoc(noteRef);
        fetchAllNotes(); // refresh list
    };

    // triggered by Share button on card
    const handleShareClick = (id) => {
      setShareNoteId(id);
      setShowShareModal(true);
    };

    const handleConfirmShare = async (targetUid) => {
      setShowShareModal(false);
      const noteRef = doc(db, "notes", shareNoteId);
      const noteSnap = await getDoc(noteRef);
      if (!noteSnap.exists()) {
        alert("Note not found.");
        return;
      }
      const noteData = noteSnap.data();
      await addDoc(collection(db, "notes"), {
        ...noteData,
        createdBy: targetUid,
        createdUsername: "", // Optionally look up
        sharedOriginal: shareNoteId,
        sharedWith: [],
        isPublic: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Note shared successfully!");
      setShareNoteId(null);
    };

  const handleCopyToDashboard = async (noteId) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      const snap = await getDoc(noteRef);
      if (!snap.exists()) return;

      const original = snap.data();

      await addDoc(collection(db, "notes"), {
        title: original.title,
        categoryType: original.categoryType,
        blocks: original.blocks,
        createdBy: user.uid,
        createdUsername: user.displayName || "",
        isPublic: false,
        sharedOriginal: noteId,
        sharedWith: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Copied to your notes");
    } catch (err) {
      alert("Error copying");
      console.error(err);
    }
    fetchAllNotes(); // refresh list
  };


  return (
    <>

     {<EditorModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialCategory={modalData.category}
        initialIsPublic={modalData.isPublic}
        initialBlocks={modalData.blocks}
      />}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          show={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShareConfirm={handleConfirmShare}
        />
      )}
      
      <div className="container-fluid">
        
        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search titles"
            value={filter.text}
            onChange={(e) => setFilter((f) => ({ ...f, text: e.target.value }))}
            className="form-control"
            title="Search by title"
          />

          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="form-select"
            title="Filter by category"
          >
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.title}>{c.title}</option>
            ))}
          </select>

          <select
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
            className="form-select"
            title="Filter note type"
          >
            <option value="all">All</option>
            <option value="own">My Notes</option>
            <option value="shared">My Copies</option>
            <option value="public">Public</option>
            <option value="sharedwithme">Shared with Me</option>
          </select>
        </div>

        <div className="d-flex mb-2">
          <h5 className="me-2">Notes</h5>
          <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
            <Button
              variant={viewType === "grid" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setViewType("grid")}
            >
              <i className="bi bi-grid-3x3-gap-fill me-1"></i> Grid
            </Button>
            <Button
              variant={viewType === "list" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setViewType("list")}
            >
              <i className="bi bi-list-task me-1"></i> List
            </Button>
          </div>

        </div>

        {viewType === "grid" ? (
        <Masonry
          breakpointCols={{ default: 3, 1200: 2, 768: 1 }}
          className="my-masonry-grid d-flex"
          columnClassName="my-masonry-grid_column"
        >
          {filtered.map((note) => (
            <Card
              key={note.id}
              idx={note.id}
              title={note.title}
              blocks={note.blocks}
              categoryType={note.categoryType}
              createdBy={note.createdBy}
              createdUsername={note.createdUsername}
              isPublic={note.isPublic}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onShare={handleShareClick}
              onCopyToDashboard={handleCopyToDashboard}
            />
          ))}
        </Masonry>
      ) : (
        <div className="list-group">
          {filtered.map((note) => (
            <div className="list-group-item" key={note.id} > 
              <Card
                key={note.id}
                idx={note.id}
                title={note.title}
                blocks={note.blocks}
                categoryType={note.categoryType}
                createdBy={note.createdBy}
                createdUsername={note.createdUsername}
                isPublic={note.isPublic}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onShare={handleShareClick}
                onCopyToDashboard={handleCopyToDashboard}
              />
            </div>
          ))}
        </div>
      )}

      </div>
      
    <div className="position-fixed bottom-0 end-0 m-3">
        <button 
            className="btn btn-sm btn-primary d-flex align-items-center" 
            data-bs-toggle="modal" 
            data-bs-target="#editormodal"
            onClick={handleAdd}
            >
          <span className="pe-1">
            New Note
          </span>
          <i className="bi bi-journal-plus fs-2"></i>
        </button>
      </div>
       {/*<div className="position-fixed bottom-0 end-0 m-3">
        <button 
          className="btn btn-sm btn-primary d-flex align-items-center" 
          data-bs-toggle="modal" 
          data-bs-target="#editormodal"
          onClick={handleAdd}
          >
          <span className="pe-1">New</span>
          <i className="bi bi-journal-plus"></i>
        </button>
      </div>*/}

     {/*<ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShareConfirm={handleConfirmShare}
      />*/}


    </>
  )
}

export default Notes