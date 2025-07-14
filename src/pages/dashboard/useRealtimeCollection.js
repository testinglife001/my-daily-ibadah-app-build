// src/hooks/useRealtimeCollection.js
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";


export function useRealtimeCollection(path, orderField = "timestamp", desc = true) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, path), orderBy(orderField, desc ? "desc" : "asc"));
    const unsub = onSnapshot(q, snap => setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [path, orderField, desc]);

  return docs;
}
