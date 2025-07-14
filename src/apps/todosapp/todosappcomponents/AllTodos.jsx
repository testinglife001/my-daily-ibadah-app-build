// src/components/AllTodos.jsx
import React, { useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import TodoCard from './TodoCard';

const AllTodos = ({ todos, setTodos, user }) => {
  const draggedTodoRef = useRef(null);

  // Ensure subtasks is always an array
  useEffect(() => {
    const todosWithSubtasks = todos.map(todo => ({
      ...todo,
      subtasks: Array.isArray(todo.subtasks) ? todo.subtasks : [],
    }));
    setTodos(todosWithSubtasks);
  }, [todos, setTodos]);

  // Drag handlers
  const onDragStart = (e, todo) => {
    draggedTodoRef.current = todo;
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, targetTodo) => {
    e.preventDefault();
    const draggedTodo = draggedTodoRef.current;
    if (!draggedTodo || draggedTodo.id === targetTodo.id) return;

    const updatedTodos = [...todos];
    const fromIndex = updatedTodos.findIndex(t => t.id === draggedTodo.id);
    const toIndex = updatedTodos.findIndex(t => t.id === targetTodo.id);
    const [moved] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, moved);

    updatedTodos.forEach((t, i) => (t.order = i + 1));
    setTodos(updatedTodos);

    try {
      await Promise.all(
        updatedTodos.map((t, index) => {
          const todoRef = doc(db, 'todos', t.id);
          return updateDoc(todoRef, { order: index + 1 });
        })
      );
    } catch (err) {
      console.error('Reorder failed:', err);
    }

    draggedTodoRef.current = null;
  };

  // Toggle completed
  const toggleCompleted = async (todoId, currentStatus) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { isCompleted: !currentStatus });

      setTodos(prev =>
        prev.map(t =>
          t.id === todoId ? { ...t, isCompleted: !currentStatus } : t
        )
      );
    } catch (err) {
      console.error('Toggle complete error:', err);
    }
  };

  // Edit title
  const editTodo = async (todoId, newTitle) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { title: newTitle });

      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, title: newTitle } : t))
      );
    } catch (err) {
      console.error('Edit todo error:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch (err) {
      console.error('Delete todo error:', err);
    }
  };

  // Toggle subtask complete
  const toggleSubtodoCompleted = async (todoId, subtaskId, currentStatus) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    const updatedSubtasks = todo.subtasks.map(st =>
      st.id === subtaskId ? { ...st, isCompleted: !currentStatus } : st
    );

    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { subtasks: updatedSubtasks });

      setTodos(prev =>
        prev.map(t =>
          t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t
        )
      );
    } catch (err) {
      console.error('Toggle subtask error:', err);
    }
  };

  // Add subtask
  const addSubtodo = async (todoId, subtaskTitle) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const newSubtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle,
      isCompleted: false,
    };

    const updatedSubtasks = [...(todo.subtasks || []), newSubtask];

    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { subtasks: updatedSubtasks });

      setTodos(prev =>
        prev.map(t =>
          t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t
        )
      );
    } catch (err) {
      console.error('Add subtask error:', err);
    }
  };

  // Delete a subtask from a todo
  const handleSubDelete = async (todoId, subtaskId) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);

    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, { subtasks: updatedSubtasks });

    setTodos(prev =>
      prev.map(t =>
        t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t
      )
    );
  };

  return (
    <div>
      {todos.length === 0 && <p>No todos found.</p>}
      {todos
        .sort((a, b) => a.order - b.order)
        .map(todo => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggleCompleted={toggleCompleted}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onAddSubtodo={addSubtodo}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onSubtodoToggleCompleted={toggleSubtodoCompleted}
            onSubtodoDelete={handleSubDelete}
            currentUser={user} // <- pass user for ownership check
          />
        ))}
    </div>
  );
};

export default AllTodos;
