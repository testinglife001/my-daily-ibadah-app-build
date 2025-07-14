import React, { useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";

// import { useAuthState } from "react-firebase-hooks/auth";



const AssignTaskForm = ({ taskId }) => {
  // const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const assignUser = async () => {
    setMessage("");

    if (!email.trim()) return;

    try {
      // Step 1: Check current user role
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!["admin", "author"].includes(userDoc.data().role)) {
        setMessage("You do not have permission to assign users.");
        return;
      }

      // Step 2: Find user by email
      const usersRef = await getDoc(doc(db, "users", user.uid));
      const snapshot = await db.collection("users").where("email", "==", email).get();

      if (snapshot.empty) {
        setMessage("User not found.");
        return;
      }

      const assignedUserDoc = snapshot.docs[0];
      const assignedUid = assignedUserDoc.id;

      // Step 3: Add taskId to user's assignedTasks
      await updateDoc(doc(db, "users", assignedUid), {
        assignedTasks: arrayUnion(taskId),
      });

      // Step 4: Add user to task's team
      await updateDoc(doc(db, "tasks", taskId), {
        team: arrayUnion(assignedUid),
      });

      setMessage("User assigned successfully!");
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Error assigning user.");
    }
  };

  return (
    <div className="mt-4">
      <h5>Assign User to Task</h5>
      <div className="input-group mb-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          className="form-control"
        />
        <button onClick={assignUser} className="btn btn-success">
          Assign
        </button>
      </div>
      {message && <div className="alert alert-info">{message}</div>}
    </div>
  );
};

export default AssignTaskForm;
