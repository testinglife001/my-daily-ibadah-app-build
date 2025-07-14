// NotesListModal.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { Card } from "react-bootstrap";


export default function NotesListModal({ title, category, show, onClose, onEdit }) {
  const [relatedNotes, setRelatedNotes] = useState([]);

  useEffect(() => {
    if (title && category) {
      const fetchNotes = async () => {
        const q = query(
          collection(db, "notes"),
          where("title", "==", title),
          where("category", "==", category)
        );
        const snapshot = await getDocs(q);
        const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRelatedNotes(notes);
      };
      fetchNotes();
    }
  }, [title, category]);

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title} — {category}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {relatedNotes.map(note => (
              <Card
                key={note.id}
                blocks={note.blocks}
                idx={note.id}
                onEdit={onEdit}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
