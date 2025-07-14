// Updated Notes.jsx
import { useContext, useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import Masonry from "react-masonry-css";
import EditorModal from "./EditorModal";
import Card from "./Card";
import CardAlt from "./CardAlt";
import { EditorContext } from "./EditorContext";
import { auth, db } from "../../../firebase";
import ShareModal from "./ShareModal";
import ShareModalAlt from "./ShareModalAlt";
import EditorModalAlt from "./EditorModalAlt";

function NotesAlt({ user }) {
  const [notesArr, setNotesArr] = useState([]);
  const [filter, setFilter] = useState({ text: "", category: "", sharedOnly: false });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", category: "", blocks: [] });

  const notesCollection = collection(db, "notes");
  const updatedId = useRef(null);
  const { editorInstanceRef } = useContext(EditorContext);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      const snapshot = await getDocs(collection(db, "category-types"));
      const options = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategoryOptions(options);
    };
    fetchCategoryTypes();
  }, []);

  const fetchAllNotes = async () => {
    if (!user) return;
    const ref = collection(db, "notes");
    const qOwn = query(ref, where("createdBy", "==", user.uid));
    const qShared = query(ref, where("sharedWith", "array-contains", user.uid));

    const [snapOwn, snapShared] = await Promise.all([getDocs(qOwn), getDocs(qShared)]);

    const combined = [
      ...snapOwn.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...snapShared.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];

    const unique = Array.from(new Map(combined.map((n) => [n.id, n])).values());
    unique.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
    setNotesArr(unique);
  };

  useEffect(() => {
    fetchAllNotes();
  }, [user]);

  const filteredNotes = notesArr.filter((note) => {
    return (
      (!filter.sharedOnly || note.sharedWith?.includes(user.uid)) &&
      (!filter.category || note.categoryType === filter.category) &&
      (!filter.text || note.title.toLowerCase().includes(filter.text.toLowerCase()))
    );
  });

  const handleSave = async (title, category) => {
    const data = await editorInstanceRef.current?.save();
    if (data?.blocks?.length === 0) return;
    if (!user) return alert("Login required");

    const payload = {
      title,
      categoryType: category,
      blocks: data?.blocks,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid,
      createdUsername: user.displayName || "",
      isPublic: false,
      sharedWith: [],
      sharedOriginal: null,
    };

    if (updatedId.current) {
      const noteRef = doc(db, "notes", updatedId.current);
      await updateDoc(noteRef, payload);
      updatedId.current = null;
    } else {
      await addDoc(notesCollection, payload);
    }
    fetchAllNotes();
  };

  const handleAdd = () => {
    updatedId.current = null;
    editorInstanceRef.current?.clear();
    setModalData({ title: "", categoryType: "", blocks: [] });
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    updatedId.current = id;
    const note = notesArr.find((note) => note.id === id);
    if (note) editorInstanceRef.current?.render({ blocks: note.blocks });
    const snap = await getDoc(doc(db, "notes", id));
    if (snap.exists()) {
      const note = snap.data();
      setModalData({ title: note.title, categoryType: note.categoryType });
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchAllNotes();
  };

  const handleShareClick = (id) => {
    setShareNoteId(id);
    setShowShareModal(true);
  };

  const handleConfirmShare = async (targetUid) => {
    setShowShareModal(false);
    const noteSnap = await getDoc(doc(db, "notes", shareNoteId));
    if (!noteSnap.exists()) return alert("Note not found.");

    const noteData = noteSnap.data();
    await addDoc(collection(db, "notes"), {
      ...noteData,
      createdBy: targetUid,
      createdUsername: "",
      sharedOriginal: shareNoteId,
      sharedWith: [],
      isPublic: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    alert("Note shared.");
  };

  return (
    <>
      <EditorModalAlt
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialCategory={modalData.category}
      />
      {showShareModal && (
        <ShareModalAlt
          show={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShareConfirm={handleConfirmShare}
        />
      )}

      <div className="container-fluid">
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search title"
            value={filter.text}
            onChange={(e) => setFilter(f => ({ ...f, text: e.target.value }))}
          />
          <select
            className="form-select form-select-sm"
            value={filter.category}
            onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
          >
            <option value="">All</option>
            {categoryOptions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <label className="form-check form-check-inline small">
            <input
              className="form-check-input"
              type="checkbox"
              checked={filter.sharedOnly}
              onChange={() => setFilter(f => ({ ...f, sharedOnly: !f.sharedOnly }))}
            /> Shared Only
          </label>
        </div>

        <div className="d-flex mb-2">
          <h5 className="me-2">Notes</h5>
        </div>

        <Masonry
          breakpointCols={{ default: 4, 1200: 3, 768: 2 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredNotes.map((note) => (
            <CardAlt
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
            />
          ))}
        </Masonry>
      </div>

      <div className="position-fixed bottom-0 end-0 m-3">
        <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={handleAdd}>
          <span className="pe-1">New</span>
          <i className="bi bi-journal-plus"></i>
        </button>
      </div>
    </>
  );
}

export default NotesAlt;

/*
// Notes.jsx
import { useContext, useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import Masonry from "react-masonry-css";
import { nanoid } from "nanoid";
import EditorModal from "./EditorModal";
import Card from "./Card";
import { EditorContext } from "./EditorContext";
import { auth, db } from "../../../firebase";
import ShareModal from "./ShareModal";
import { toast } from "react-toastify";

function Notes({ user }) {
  const [notesArr, setNotesArr] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filter, setFilter] = useState({ text: "", category: "", type: "all" });
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", category: "", blocks: [] });

  const notesCollection = collection(db, "notes");
  const updatedId = useRef(null);
  const { editorInstanceRef } = useContext(EditorContext);

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

    const notes = combined.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotesArr(notes.reverse());
  };

  useEffect(() => {
    if (user) fetchAllNotes();
  }, [user]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      const snapshot = await getDocs(collection(db, "category-types"));
      const options = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategoryOptions(options);
    };
    fetchCategoryTypes();
  }, []);

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

  const handleSave = async (title, category) => {
    const data = await editorInstanceRef.current.save();
    if (data.blocks.length === 0) return;

    if (updatedId.current) {
      const noteRef = doc(db, "notes", updatedId.current);
      await updateDoc(noteRef, {
        title,
        categoryType: category,
        blocks: data.blocks,
        updatedAt: new Date(),
      });
      updatedId.current = null;
    } else {
      await addDoc(notesCollection, {
        title,
        categoryType: category,
        blocks: data.blocks,
        createdAt: new Date(),
        createdBy: user.uid,
        createdUsername: user.displayName || "",
        isPublic: false,
        sharedOriginal: null,
        sharedWith: [],
      });
    }

    fetchAllNotes();
  };

  const handleAdd = () => {
    updatedId.current = null;
    editorInstanceRef.current.clear();
    setModalData({ title: "", categoryType: "", blocks: [] });
    setShowModal(true);
  };

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
        });
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error loading note:", err);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchAllNotes();
  };

  const handleShareClick = (id) => {
    setShareNoteId(id);
    setShowShareModal(true);
  };

  const handleConfirmShare = async (targetUid) => {
    setShowShareModal(false);
    const noteRef = doc(db, "notes", shareNoteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists()) return;

    const noteData = noteSnap.data();

    await addDoc(collection(db, "notes"), {
      ...noteData,
      createdBy: targetUid,
      createdUsername: "",
      sharedOriginal: shareNoteId,
      sharedWith: [],
      isPublic: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success("Note shared successfully!");
    setShareNoteId(null);
  };

  const handleCopyToDashboard = async (noteId) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      const snap = await getDoc(noteRef);
      if (!snap.exists()) return;

      const original = snap.data();

      await addDoc(notesCollection, {
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

      toast.success("Note copied to your dashboard!");
      fetchAllNotes();
    } catch (err) {
      toast.error("Copy failed");
      console.error(err);
    }
  };

  return (
    <>
      <EditorModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialCategory={modalData.categoryType}
      />

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
              <option key={c.id} value={c.name}>{c.name}</option>
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
              sharedOriginal={note.sharedOriginal}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onShare={handleShareClick}
              onCopyToDashboard={handleCopyToDashboard}
            />
          ))}
        </Masonry>

        <div className="position-fixed bottom-0 end-0 m-4 z-2">
          <button
            className="btn btn-primary d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#editormodal"
            onClick={handleAdd}
          >
            <span className="pe-2">New Note</span>
            <i className="bi bi-journal-plus fs-5"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default Notes;
*/
