// SharedNotes.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Card from "./Card";
import { db, auth } from "../../../firebase";

export default function SharedNotes() {
  const [notesArr, setNotesArr] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchShared = async () => {
      if (!user) return;
      const notesRef = collection(db, "notes");
      const q = query(
        notesRef,
        where("isPublic", "==", true),
      );
      const qr2 = query(
        notesRef,
        where("sharedWith", "array-contains", user.uid),
      );

      const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(qr2)]);
      const arr1 = snap1.docs.map(d => ({ id: d.id, ...d.data() }));
      const arr2 = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
      const merged = [...arr1, ...arr2];
      const unique = Array.from(new Map(merged.map(n => [n.id, n])).values());
      unique.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setNotesArr(unique);
    };
    fetchShared();
  }, [user]);

  return (
    <div className="container my-4">
      <h3>Public & Shared With Me</h3>
      <div className="row">
        {notesArr.map((note) => (
          <Card
            key={note.id}
            idx={note.id}
            title={note.title}
            blocks={note.blocks}
            categoryType={note.categoryType}
            createdBy={note.createdBy}
            createdByUsername={note.createdByUsername}
            isPublic={note.isPublic}
          />
        ))}
      </div>
    </div>
  );
}
