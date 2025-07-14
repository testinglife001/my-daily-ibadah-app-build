// "src/components/SubtaskManager.jsx": """
import { useEffect, useState } from 'react';

import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import AddSubTaskForm from './AddSubTaskForm';
// import AddSubTaskForm from './AddSubTaskForm';

const SubtaskManager = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState([]);

  const fetchSubtasks = async () => {
    const q = query(collection(db, 'subtasks'), where('taskId', '==', taskId));
    const snapshot = await getDocs(q);
    setSubtasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, 'subtasks', id), { completed: !current });
    fetchSubtasks();
  };

  useEffect(() => {
    fetchSubtasks();
  }, [taskId]);

  return (
    <div>
      <h4>Subtasks</h4>
      <ul>
        {subtasks.map(subtask => (
          <li key={subtask.id}>
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => toggleComplete(subtask.id, subtask.completed)}
            />
            {subtask.title}
          </li>
        ))}
      </ul>
      <AddSubTaskForm taskId={taskId} onSubTaskAdded={fetchSubtasks} />
    </div>
  );
};

export default SubtaskManager;