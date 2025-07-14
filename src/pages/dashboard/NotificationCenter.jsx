// src/components/Dashboard/NotificationCenter.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const NotificationCenter = ({ user }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const markSeen = async (id) => {
    await updateDoc(doc(db, "notifications", id), { seen: true });
  };

  return (
    <div>
      <h4>Notifications</h4>
      <ul className="list-group">
        {notes.map(n => (
          <li key={n.id} className={`list-group-item ${n.seen ? "" : "fw-bold"}`}>
            {n.message} <small className="text-muted">{new Date(n.createdAt.seconds * 1000).toLocaleString()}</small>
            {!n.seen && <button className="btn btn-sm btn-link" onClick={() => markSeen(n.id)}>Mark read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter;
