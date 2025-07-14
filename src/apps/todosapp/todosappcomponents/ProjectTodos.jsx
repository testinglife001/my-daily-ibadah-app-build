// ProjectTodos.jsx
import React from 'react';
import TodoCard from './TodoCard';


const ProjectTodos = ({ todos, selectedProjectId }) => {
  const projectTodos = todos.filter(todo => todo.projectId === selectedProjectId);

  return (
    <div>
      <hr/>
      <h4>Project Todos</h4>
      <hr/>
      {projectTodos.map(todo => <TodoCard key={todo.id} todo={todo} />)}
      <br/><hr/><hr/>
    </div>
  );
};

export default ProjectTodos;