import { useEffect, useState } from 'react';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import TaskCard from './TaskCard';
// import TaskCard from './TaskCard';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, 'tasks'));
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h3>All Tasks</h3>
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
};

export default TaskList;
