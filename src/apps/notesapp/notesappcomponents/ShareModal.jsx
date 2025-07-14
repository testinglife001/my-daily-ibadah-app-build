// ShareModal.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function ShareModal({ show, onClose, onShareConfirm }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUid, setSelectedUid] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setAllUsers(snap.docs.map(d => d.data()));
    };
    fetchUsers();
  }, []);

  const handleShare = () => {
    if (selectedUid) {
      onShareConfirm(selectedUid);
      setSelectedUid("");
    }
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Note</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <select className="form-select" value={selectedUid} onChange={(e) => setSelectedUid(e.target.value)}>
              <option value="">Select user to share with</option>
              {allUsers.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.displayName} ({user.uid})
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}
