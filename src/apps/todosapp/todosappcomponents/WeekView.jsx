// WeekView.jsx
import React from 'react';
import { isThisWeek } from 'date-fns';

const WeekView = ({ todos, onToggleComplete }) => {
  const weekTodos = todos.filter(todo =>
    todo.dueDate ? isThisWeek(new Date(todo.dueDate), { weekStartsOn: 1 }) : false
  );

  return (
    <div>
      <h4>This Week</h4>
      {weekTodos.map(todo => (
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

export default WeekView;