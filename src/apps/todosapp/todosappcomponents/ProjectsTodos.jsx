// ProjectsTodos.jsx
import { doc, updateDoc } from 'firebase/firestore';
import React, { useRef, useState } from 'react';

import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../../firebase';

const ProjectsTodos = ({ todos, setTodos }) => {

    const [viewMode, setViewMode] = useState('list');

    const draggedTodoRef = useRef(null);
    
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

        // Reorder in local state
        const updatedTodos = [...todos];
        const fromIndex = updatedTodos.findIndex(t => t.id === draggedTodo.id);
        const toIndex = updatedTodos.findIndex(t => t.id === targetTodo.id);
        const [moved] = updatedTodos.splice(fromIndex, 1);
        updatedTodos.splice(toIndex, 0, moved);

        // Update order field in Firestore (if you have an order field)
        // For demo: update order property locally
        updatedTodos.forEach((t, i) => (t.order = i + 1));
        setTodos(updatedTodos);

        // Update Firestore
        await Promise.all(
        updatedTodos.map((t, index) => {
            const todoRef = doc(db, 'todos', t.id);
            return updateDoc(todoRef, { order: index + 1 });
        })
        );

        draggedTodoRef.current = null;
    };


  const handleToggleComplete = async (todoId, currentStatus) => {
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, {
      isCompleted: !currentStatus,
    });

    // Update local state immediately
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, isCompleted: !currentStatus } : t
      )
    );
  };

  return (
    <div>
      <h4>Project Todos</h4>
        <div className="d-flex justify-content-end mb-3">
        <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setViewMode('list')}
        >
            <i className="bi bi-list" /> List
        </Button>
        <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
        >
            <i className="bi bi-grid-3x3-gap-fill" /> Grid
        </Button>
        </div>

      {todos.map(todo => (
        <div key={todo.id} className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={todo.isCompleted}
            onChange={() => handleToggleComplete(todo.id, todo.isCompleted)}
          />
          <label
            className={`form-check-label ${todo.isCompleted ? 'text-muted text-decoration-line-through' : ''}`}
          >
            {todo.title}
          </label>
        </div>
      ))}

      <div className={viewMode === 'grid' ? 'row' : ''}>
        {todos.map((todo) => (
            <div
            key={todo.id}
            className={
                viewMode === 'grid' ? 'col-md-4 mb-3' : 'mb-2'
            }
            draggable
            onDragStart={() => onDragStart(todo)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(todo)}
            >
            <div className="p-3 border rounded bg-white shadow-sm d-flex justify-content-between align-items-start">
                <div>
                <h5>{todo.title}</h5>
                <p className="text-muted small">{todo.text}</p>
                <p className="small text-secondary">
                    {todo.date?.toDate?.().toLocaleString()}
                </p>
                </div>
                <div>
                <FaEdit onClick={() => openEditModal(todo)} className="me-2 text-warning cursor-pointer" />
                <FaTrash onClick={() => handleDelete(todo.id)} className="text-danger cursor-pointer" />
                </div>
            </div>
            </div>
        ))}
        </div>


    </div>
  );
};

export default ProjectsTodos;
