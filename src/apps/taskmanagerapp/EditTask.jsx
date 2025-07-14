// File: src/pages/EditTask.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// import { useAuth } from '../hooks/useAuth';

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const taskRef = doc(db, 'tasks', taskId);
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    if (task.createdBy === user.uid) {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
      });
      navigate(`/task/${taskId}`);
    } else {
      alert("You don't have permission to edit this task.");
    }
  };

  const handleDelete = async () => {
    if (task.createdBy === user.uid) {
      await deleteDoc(doc(db, 'tasks', taskId));
      navigate('/dashboard');
    } else {
      alert("You don't have permission to delete this task.");
    }
  };

  if (loading) return <div>Loading task...</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div>
      <h2>Edit Task</h2>
      <label>Title:</label>
      <input
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <label>Description:</label>
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <label>Priority:</label>
      <select
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label>Due Date:</label>
      <input
        type="date"
        value={task.dueDate?.split('T')[0] || ''}
        onChange={(e) =>
          setTask({ ...task, dueDate: new Date(e.target.value).toISOString() })
        }
      />

      <br />
      <button onClick={handleUpdate}>Update Task</button>
      <button onClick={handleDelete} style={{ color: 'red' }}>
        Delete Task
      </button>
    </div>
  );
};

export default EditTask;
