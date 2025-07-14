import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";


const DisplayTasks = ({ user, filterStage = null }) => {
  // const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Get current user role
  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDocs(collection(db, "users"));
      const currentUser = userDoc.docs.find(doc => doc.id === user.uid);
      if (currentUser) setUserData(currentUser.data());
    };
    if (user) fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      let q;
      if (!userData) return;

      const tasksRef = collection(db, "tasks");

      // Admins & Authors see all tasks
      if (userData.role === "admin" || userData.role === "author") {
        q = query(tasksRef);
      } else {
        // Users see tasks assigned to them or created by them
        q = query(tasksRef);
      }

      const snapshot = await getDocs(q);
      let allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Apply filtering manually (stage, team match, creator match)
      if (userData.role === "user") {
        allTasks = allTasks.filter(
          t => t.createdBy === user.uid || t.team.includes(user.uid)
        );
      }

      if (filterStage) {
        allTasks = allTasks.filter(t => t.stage === filterStage);
      }

      setTasks(allTasks);
    };

    if (userData) fetchTasks();
  }, [userData, filterStage]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="container mt-3">
      <h4>Your Tasks {filterStage && `(Stage: ${filterStage})`}</h4>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="row">
          {tasks.map(task => (
            <div className="col-md-4 mb-3" key={task.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description}</p>
                  <p className="badge bg-primary">{task.priority}</p>
                  <p className="badge bg-secondary">{task.stage}</p>
                  <small className="text-muted">
                    Team: {task.team?.length} | Tags: {task.tags?.join(", ")}
                  </small>
                  <Link to={`/task/${task.id}`} className="stretched-link">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayTasks;
