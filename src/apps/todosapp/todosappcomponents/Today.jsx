// Today.jsx
import React from 'react';
import { isToday } from 'date-fns';

const Today = ({ todos, onToggleComplete }) => {
  const todayTodos = todos.filter(todo =>
    todo.dueDate ? isToday(new Date(todo.dueDate)) : false
  );

  return (
    <div>
      <h4>Today</h4>
      {todayTodos.map(todo => (
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

export default Today;
