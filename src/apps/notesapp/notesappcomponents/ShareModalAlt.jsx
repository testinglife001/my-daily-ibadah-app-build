// ShareModal.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

function ShareModalAlt({ show, onClose, onShareConfirm }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUid, setSelectedUid] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const users = snap.docs.map(doc => doc.data());
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const handleShare = () => {
    if (selectedUid) {
      onShareConfirm(selectedUid);
      setSelectedUid("");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Note</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label>Select user to share with:</label>
            <select
              className="form-select mt-2"
              value={selectedUid}
              onChange={(e) => setSelectedUid(e.target.value)}
            >
              <option value="">-- Select User --</option>
              {allUsers.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.displayName || user.email} ({user.uid})
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleShare} disabled={!selectedUid}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModalAlt;
