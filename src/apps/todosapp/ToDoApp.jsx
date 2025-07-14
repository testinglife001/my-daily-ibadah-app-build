// ToDoApp.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  fetchAllTodos,
  fetchCategories,
  fetchProjectsByCategory,
  fetchTodos,
  fetchTodosByProject,
  fetchTodosForToday,
  fetchTodosForWeek
} from '../../utils/todosapp';
import SidebarAlt from './todosappcomponents/SidebarAlt';
import ProjectsTodos from './todosappcomponents/ProjectsTodos';
import Inbox from './todosappcomponents/Inbox';
import Today from './todosappcomponents/Today';
import WeekView from './todosappcomponents/WeekView';
import AllTodos from './todosappcomponents/AllTodos';

const ToDoApp = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [projectsByCategory, setProjectsByCategory] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('inbox');
  const [todos, setTodos] = useState([]);
  const [selectedView, setSelectedView] = useState('Inbox');
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch categories by user
  useEffect(() => {
    if (!user) return;
    const loadCategories = async () => {
      const cats = await fetchCategories(user.uid);
      setCategories(cats);
    };
    loadCategories();
  }, [user]);

  // Fetch projects by selected category
  useEffect(() => {
    if (!user || !selectedCategoryId) return;
    const loadProjects = async () => {
      const projs = await fetchProjectsByCategory(selectedCategoryId, user.uid);
      setProjectsByCategory(prev => ({ ...prev, [selectedCategoryId]: projs }));
    };
    loadProjects();
  }, [selectedCategoryId, user]);

  // Fetch todos based on selected filter
  useEffect(() => {
    if (!user) return;
    const loadTodos = async () => {
      let loadedTodos = [];
      switch (selectedFilter) {
        case 'today':
          loadedTodos = await fetchTodosForToday(user.uid);
          break;
        case 'week':
          loadedTodos = await fetchTodosForWeek(user.uid);
          break;
        case 'all':
          loadedTodos = await fetchAllTodos(user.uid);
          break;
        default:
          if (selectedProjectId) {
            loadedTodos = await fetchTodosByProject(selectedProjectId, user.uid);
          } else {
            loadedTodos = await fetchTodos(user.uid);
          }
      }
      setTodos(loadedTodos);
    };
    loadTodos();
  }, [selectedFilter, selectedProjectId, user]);

  const getFilteredTodos = () => {
    const now = new Date();
    return todos.filter(todo => {
      switch (selectedView) {
        case 'Inbox':
          return !todo.dueDate;
        case 'Today':
          return todo.dueDate && new Date(todo.dueDate).toDateString() === now.toDateString();
        case 'Week':
          if (!todo.dueDate) return false;
          const due = new Date(todo.dueDate);
          const diffDays = (due - now) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays < 7;
        case 'ProjectTodos':
          return todo.projectId === selectedProject;
        case 'AllTodos':
        default:
          return true;
      }
    });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    setSelectedProjectId(null);
    setSelectedFilter(null);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedFilter(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setSelectedCategoryId(null);
    setSelectedProjectId(null);
  };

  return (
    <Container fluid>
      <div className="d-flex flex-column vh-100">
        <Row>
          <Col md={3}>
            <SidebarAlt
              user={user}
              categories={categories}
              projectsByCategory={projectsByCategory}
              onCategorySelect={handleCategorySelect}
              onProjectSelect={handleProjectSelect}
              onFilterSelect={handleFilterSelect}
              selectedFilter={selectedFilter}
              selectedCategoryId={selectedCategoryId}
              selectedProjectId={selectedProjectId}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              setSelectedProject={setSelectedProject}
              onSelectProject={(projectId) => setSelectedProject(projectId)}
            />
          </Col>
          <Col md={9}>
            <main className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
              {selectedView === 'Inbox' && <Inbox todos={getFilteredTodos()} setTodos={setTodos} />}
              {selectedView === 'Today' && <Today todos={getFilteredTodos()} setTodos={setTodos} />}
              {selectedView === 'Week' && <WeekView todos={getFilteredTodos()} setTodos={setTodos} />}
              {selectedView === 'AllTodos' && <AllTodos todos={getFilteredTodos()} setTodos={setTodos} user={user}  />}
              {selectedView === 'ProjectTodos' && selectedProject && (
                <ProjectsTodos todos={getFilteredTodos()} setTodos={setTodos} projectId={selectedProject} />
              )}
            </main>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ToDoApp;
