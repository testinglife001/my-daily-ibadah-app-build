// "src/components/AddSubTaskForm.jsx": """
import { useState } from 'react';

import { collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const AddSubTaskForm = ({ taskId, onSubTaskAdded }) => {
  const [title, setTitle] = useState('');

   const subtask = {
      title: title,
      completed: false
    };
  
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    /*
    await addDoc(collection(db, 'subtasks'), {
      taskId,
      title,
      completed: false,
      createdAt: serverTimestamp()
    });
    */

    await updateDoc(doc(db, 'tasks', taskId), {
      subtasks: arrayUnion(subtask)
    });

    setTitle('');
    onSubTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a subtask"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddSubTaskForm;