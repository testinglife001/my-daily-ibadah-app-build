// AllNotes.jsx
/*
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Masonry from "react-masonry-css";
import Card from "./Card";
import CardAlt from "./CardAlt";

function AllNotesAlt() {
  const [notesArr, setNotesArr] = useState([]);

  const fetchAllNotes = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const publicNotesQuery = query(
      collection(db, "notes"),
      where("isPublic", "==", true)
    );

    const sharedNotesQuery = query(
      collection(db, "notes"),
      where("createdBy", "==", user.uid),
      where("sharedOriginal", "!=", null)
    );

    const [publicSnap, sharedSnap] = await Promise.all([
      getDocs(publicNotesQuery),
      getDocs(sharedNotesQuery)
    ]);

    const publicNotes = publicSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sharedNotes = sharedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const combined = [...publicNotes, ...sharedNotes];

    setNotesArr(combined.reverse());
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div className="container my-4">
      <h3 className="mb-3">All Public & Shared Notes</h3>
      <Masonry
        breakpointCols={{ default: 3, 1200: 2, 768: 1 }}
        className="my-masonry-grid d-flex"
        columnClassName="my-masonry-grid_column"
      >
        {notesArr.map(note => (
          <CardAlt
            key={note.id}
            idx={note.id}
            title={note.title}
            blocks={note.blocks}
            categoryType={note.categoryType}
            createdBy={note.createdBy}
            createdUsername={note.createdUsername}
            isPublic={note.isPublic}
            onDelete={() => {}}
            onEdit={() => {}}
            onShare={() => {}}
            readonly
          />
          
        ))}
      </Masonry>
    </div>
  );
}

export default AllNotesAlt;
*/

// Updated AllNotes.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import Card from "./Card";

export default function AllNotesAlt({ user }) {
  const [notesArr, setNotesArr] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      const ref = collection(db, "notes");
      const qPublic = query(ref, where("isPublic", "==", true));
      const qShared = query(ref, where("sharedWith", "array-contains", user.uid));

      const [snapPub, snapShared] = await Promise.all([
        getDocs(qPublic),
        getDocs(qShared)
      ]);

      const combined = [
        ...snapPub.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snapShared.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ];

      const unique = Array.from(new Map(combined.map(n => [n.id, n])).values());
      setNotesArr(unique);
    };
    fetchAll();
  }, [user]);

  return (
    <div className="container mt-2">
      <h6>Public / Shared With Me</h6>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2">
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
            copyToDashboard={true}
          />
        ))}
      </div>
    </div>
  );
}
