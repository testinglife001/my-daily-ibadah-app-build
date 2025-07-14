// Inbox.jsx
import React from 'react';

const Inbox = ({ todos, onToggleComplete }) => {
  const inboxTodos = todos.filter(todo => !todo.projectId);
  return (
    <div>
      <h4>Inbox</h4>
      {inboxTodos.map(todo => (
        <div key={todo.id} className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={todo.isCompleted}
            onChange={() => onToggleComplete(todo.id, todo.isCompleted)}
          />
          <label
            className={`form-check-label ${todo.isCompleted ? 'text-muted text-decoration-line-through' : ''}`}
          >
            {todo.title}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Inbox;