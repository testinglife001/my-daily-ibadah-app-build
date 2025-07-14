import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

import InnerCard from "./InnerCard"; // reuses your card layout
import { db } from "../../../firebase";

function ViewNotes() {
  const { combinedId } = useParams();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const [decodedTitle, decodedCategory] = decodeURIComponent(combinedId).split("___");
    setTitle(decodedTitle);
    setCategory(decodedCategory);

    const fetchNotes = async () => {
      const q = query(
        collection(db, "notes"),
        where("title", "==", decodedTitle),
        where("category", "==", decodedCategory)
      );
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    };

    fetchNotes();
  }, [combinedId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{title}</h2>
      <h5 className="text-muted mb-4">{category}</h5>

      {notes.length === 0 ? (
        <p>No notes found for this title and category.</p>
      ) : (
        <div className="row">
          {notes.map((note, idx) => (
            <InnerCard
              key={note.id}
              blocks={note.blocks}
              idx={idx}
              onDelete={() => console.log("Delete note", note.id)}
              onEdit={() => console.log("Edit note", note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewNotes;
