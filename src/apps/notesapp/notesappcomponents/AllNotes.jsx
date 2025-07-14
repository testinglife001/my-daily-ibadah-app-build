// AllNotes.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Card from "./Card";

export default function AllNotes({ user }) {
  const [notesArr, setNotesArr] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      const ref = collection(db, "notes");
      const qOwn = query(ref, where("createdBy", "==", user.uid));
      const qPublic = query(ref, where("isPublic", "==", true));
      const qShared = query(ref, where("sharedWith", "array-contains", user.uid));

      const [snapOwn, snapPub, snapShared] = await Promise.all([
        getDocs(qOwn),
        getDocs(qPublic),
        getDocs(qShared)
      ]);

      const combined = [
        ...snapOwn.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snapPub.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snapShared.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ];

      // Remove duplicates
      const unique = Array.from(new Map(combined.map(n => [n.id, n])).values());
      unique.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setNotesArr(unique);
    };

    fetchAll();
  }, [user]);

  return (
    <div className="container my-4">
      <h3>All Notes</h3>
      <div className="row">
        {notesArr.map(note => (
          <Card
            key={note.id}
            idx={note.id}
            title={note.title}
            blocks={note.blocks}
            categoryType={note.categoryType}
            createdBy={note.createdBy}
            createdUsername={note.createdUsername}
            isPublic={note.isPublic}
            sharedWith={note.sharedWith}
          />
        ))}
      </div>
    </div>
  );
}
