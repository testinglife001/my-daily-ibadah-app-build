import React, { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { Spinner, Table, Badge } from "react-bootstrap";
import { db } from "../../firebase";
import DisplayTasks from "./taskmanagerappcomponents/DisplayTasks";

// import DisplayTasks from "../components/DisplayTasks";



const TaskDashboard = ({user}) => {
  // const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const assignedIds = userDoc.data()?.assignedTasks || [];

        const allTasks = [];
        let todo = 0,
          inProgress = 0,
          completed = 0;

        for (const id of assignedIds) {
          const taskDoc = await getDoc(doc(db, "tasks", id));
          if (taskDoc.exists()) {
            const taskData = { id: taskDoc.id, ...taskDoc.data() };
            allTasks.push(taskData);

            if (taskData.stage === "todo") todo++;
            else if (taskData.stage === "in progress") inProgress++;
            else if (taskData.stage === "completed") completed++;
          }
        }

        setTasks(allTasks);
        setStats({
          total: allTasks.length,
          todo,
          inProgress,
          completed,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssignedTasks();
  }, [user]);

  const priorityColor = (p) => {
    switch (p) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "normal":
        return "info";
      case "low":
        return "secondary";
      default:
        return "dark";
    }
  };

  if (loading) return <Spinner animation="border" />;

  console.log(tasks);

  return (
    <div className="container mt-4">
      <h3>📊 Dashboard</h3>

      <div className="d-flex gap-4 my-3">
        <div className="bg-primary text-white p-3 rounded">Total: {stats.total}</div>
        <div className="bg-secondary text-white p-3 rounded">Todo: {stats.todo}</div>
        <div className="bg-warning text-dark p-3 rounded">In Progress: {stats.inProgress}</div>
        <div className="bg-success text-white p-3 rounded">Completed: {stats.completed}</div>
      </div>

      <h5 className="mt-4">📝 Assigned Tasks</h5>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td><Badge bg={priorityColor(t.priority)}>{t.priority}</Badge></td>
              <td>{t.stage}</td>
              <td>{t.dueDate?.toDate().toLocaleDateString() || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DisplayTasks user={user} />
      <DisplayTasks user={user} filterStage="todo" />
      <DisplayTasks user={user} filterStage="in-progress" />
      <DisplayTasks user={user} filterStage="completed" />

    </div>
  );
};

export default TaskDashboard;
