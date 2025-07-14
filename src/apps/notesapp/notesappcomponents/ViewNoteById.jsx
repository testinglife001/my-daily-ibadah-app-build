import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";

import InnerCard from "./InnerCard"; // Your note card component
import { db } from "../../../firebase";

function ViewNoteById({user}) {

  const { id } = useParams();
  // const { idx } = useParams();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Step 1: Get note by ID
        const noteRef = doc(db, "notes", id);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
          const { title, category } = noteSnap.data();
          setTitle(title);
          setCategory(category);

          // Step 2: Fetch all notes with same title and category
          const q = query(
            collection(db, "notes"),
          //  where("id", "==", id),
          //  where("category", "==", category)
          );
          const querySnap = await getDocs(q);

          const allNotes = querySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setNotes(allNotes);
        } else {
          console.error("Note not found");
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [id]);

  return (
    <div className="container my-4">
      <h3 className="mb-3">{title} - {category}</h3>
      <div className="row">
        {notes.map((note, idx) => (
          <InnerCard key={note.id} blocks={note.blocks} idx={idx} />
        ))}
      </div>
    </div>
  );
}

export default ViewNoteById;
