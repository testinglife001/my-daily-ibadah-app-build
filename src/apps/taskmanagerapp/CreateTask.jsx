import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";

// import { useAuthState } from "react-firebase-hooks/auth";

const CreateTask = () => {

  // const [user] = useAuthState(auth);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "normal",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Fetch all users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
      }));
      setAllUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleCreateTask = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "in", selectedEmails)
      );
      const querySnapshot = await getDocs(q);

      const userIds = [];
      const userDocRefs = [];

      querySnapshot.forEach((docSnap) => {
        userIds.push(docSnap.id);
        userDocRefs.push(doc(db, "users", docSnap.id));
      });

      const taskRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdBy: user.uid,
        stage: "todo",
        team: userIds,
        activities: [],
        subtasks: [],
        tags: [],
      });

        const taskId = taskRef.id;

        // Update users with assigned task ID
        const updatePromises = userDocRefs.map((userRef) =>
        updateDoc(userRef, {
            assignedTasks: arrayUnion(taskId),
        })
        );

      await Promise.all(updatePromises);

      alert("✅ Task created and assigned successfully");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="p-3">
      <h4>Create Task</h4>
      <input
        placeholder="Title"
        className="form-control my-2"
        value={taskData.title}
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="form-control my-2"
        value={taskData.description}
        onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
      />
      <input
        type="date"
        className="form-control my-2"
        value={taskData.dueDate}
        onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
      />
      <select
        className="form-control my-2"
        value={taskData.priority}
        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="normal">Normal</option>
        <option value="low">Low</option>
      </select>

      <label>Assign Users by Email</label>
      <select
        multiple
        className="form-control my-2"
        value={selectedEmails}
        onChange={(e) =>
          setSelectedEmails(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {allUsers.map((u) => (
          <option key={u.id} value={u.email}>
            {u.email}
          </option>
        ))}
      </select>

      <button onClick={handleCreateTask} className="btn btn-primary mt-2">
        Create Task
      </button>
    </div>
  );
};

export default CreateTask;
