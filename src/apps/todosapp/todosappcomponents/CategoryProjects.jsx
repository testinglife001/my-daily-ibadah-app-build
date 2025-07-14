// CategoryProjects.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const CategoryProjects = ({ projects, selectedCategory, onSelectProject, onShowAddProject, setShowAddProject }) => {
  const filteredProjects = selectedCategory
    ? projects.filter(p => p.categoryId === selectedCategory)
    : projects;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <b className="text-muted mb-0">Projects</b>
        <div style={{ cursor: 'pointer' }}>
            
            <Button
                size="sm"
                variant="outline-primary"
                className="mt-2 d-flex align-items-center"
                onClick={() => setShowAddProject(true)}
            >
                <FaPlus className="m-1" /> {/* Category */}
            </Button>
        </div>

      </div>
       
      <ul className="list-group">
        {filteredProjects.map(project => (
          <li
            key={project.id}
            className="list-group-item list-group-item-action"
            // onClick={() => onSelectProject(project.id)}
            onClick={() => onSelectProject?.(project.id)}
            style={{ cursor: 'pointer' }}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryProjects;