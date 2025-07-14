import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const MyNotifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      // orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setNotifications(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return () => unsub();
  }, [user]);


  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  return (
    <div className="container mt-4">
      <h5>My Notifications</h5>
      {notifications.length === 0 && <p>No notifications.</p>}
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 border rounded mb-2 ${n.read ? "bg-light" : "bg-warning"}`}
        >
          <strong>{n.message}</strong>
          <div className="text-end mt-2">
            {!n.read && (
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => markAsRead(n.id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyNotifications;
