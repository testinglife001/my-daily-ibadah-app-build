import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { db } from '../../firebase';
import moment from 'moment';
import './TodosApp.css';
import Sidebar from './todosappcomponents/Sidebar';
import ProjectTodos from './todosappcomponents/ProjectTodos';
import TodoList from './todosappcomponents/TodoList';
import AddCategoryModal from './todosappcomponents/AddCategoryModal';
import AddProjectModal from './todosappcomponents/AddProjectModal';
import TodoModal from './todosappcomponents/TodoModal';
import { FaPlus } from 'react-icons/fa';
import Footer from './todosappcomponents/Footer';
import Navbar from './todosappcomponents/Navbar';

const TodosApp = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('inbox');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const [mvcategories, setMVCategories] = useState([]);
  const [mvprojects, setMVProjects] = useState([]);
  const [mvtodos, setMVTodos] = useState([]);
  const [mvselectedCategory, setMVSelectedCategory] = useState('');
  const [mvselectedProjectId, setMVSelectedProjectId] = useState(null);

  const [selectedView, setSelectedView] = useState('');

  console.log(user);

  useEffect(() => {
    const fetchDataMV = async () => {
      const catSnap = await getDocs(query(collection(db, 'category-todos'), where("createdBy", "==", user.uid)));
      const projSnap = await getDocs(query(collection(db, 'projects'), where("createdBy", "==", user.uid)));
      const todoSnap = await getDocs(query(collection(db, 'todos'), where("createdBy", "==", user.uid)));

      setMVCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMVProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMVTodos(todoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (user?.uid) fetchDataMV();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(query(collection(db, 'category-todos'), where("createdBy", "==", user.uid)));
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (user?.uid) fetchCategories();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(query(collection(db, 'projects'), where("createdBy", "==", user.uid)));
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (user?.uid) fetchProjects();
  }, [user]);

  const fetchProjectsByCategory = async (categoryId) => {
    if (!user?.uid || !categoryId) {
      console.warn("Missing user or categoryId in fetchProjectsByCategory");
      return [];
    }

    try {
      const q = query(
        collection(db, "projects"),
        where("categoryId", "==", categoryId),
        where("createdBy", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const projectsByCat = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return projectsByCat;
    } catch (error) {
      console.error("Error fetching projects by category:", error);
      return [];
    }
  };


  const fetchTodos = async () => {
    let q = query(collection(db, 'todos'), where("createdBy", "==", user.uid));

    if (view === 'today') {
      const today = moment().format('YYYY-MM-DD');
      q = query(q, where('date', '==', today));
    } else if (view === 'week') {
      const start = moment().startOf('week').format('YYYY-MM-DD');
      const end = moment().endOf('week').format('YYYY-MM-DD');
      q = query(q, where('date', '>=', start), where('date', '<=', end));
    } else if (view === 'project' && selectedProject) {
      q = query(q, where('projectId', '==', selectedProject));
    } else if (view === 'category' && selectedCategory) {
      q = query(q, where('categoryId', '==', selectedCategory));
    }

    const querySnapshot = await getDocs(q);
    const fetchedTodos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(fetchedTodos.sort((a, b) => a.order - b.order));
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  return (
    <div className="todosapp">
      {alert.show && <Alert variant={alert.variant} className="m-3 text-center">{alert.message}</Alert>}
      <Container fluid>
        <Row>
          <Col md={3}>
            <Sidebar
              categories={categories}
              projects={projects}
              onCategorySelect={(id) => {
                const cat = categories.find(c => c.id === id);
                setSelectedCategory(cat || null);
                setSelectedProject(null);
              }}
              onProjectSelect={(id) => {
                const proj = projects.find(p => p.id === id);
                setSelectedProject(proj || null);
              }}
              onShowAddCategory={() => setShowAddCategory(true)}
              onShowAddProject={() => setShowAddProject(true)}
              onShowAddTodo={() => { setShowAddTodo(true); setEditTodo(null); }}
              onViewChange={setView}
              setShowAddCategory={setShowAddCategory}
              setShowAddProject={setShowAddProject}
              setShowAddTodo={setShowAddTodo}
              fetchProjectsByCategory={fetchProjectsByCategory}
              mvcategories={mvcategories}
              mvprojects={mvprojects}
              mvselectedCategory={mvselectedCategory}
              setMVSelectedCategory={setMVSelectedCategory}
              setMVSelectedProjectId={setMVSelectedProjectId}
            />
          </Col>
          <Col md={9}>
            <div className="border-bottom">
              <ProjectTodos todos={mvtodos} selectedProjectId={mvselectedProjectId} />
            </div>
            <div className="border-bottom"></div>
            <TodoList
              view={view}
              categories={categories}
              projects={projects}
              selectedCategoryId={selectedCategory?.id}
              selectedProjectId={selectedProject?.id}
              onEditTodo={(todo) => {
                setEditTodo(todo);
                setShowAddTodo(true);
              }}
            />
          </Col>
        </Row>
      </Container>

      <AddCategoryModal
        show={showAddCategory}
        onHide={() => setShowAddCategory(false)}
        user={user} // ✅ pass user
        onCategoryAdded={(newCat) => {
          setCategories(prev => [...prev, newCat]);
          showAlert("Category added successfully!");
        }}
      />

      <AddProjectModal
        show={showAddProject}
        onHide={() => setShowAddProject(false)}
        categories={categories}
        user={user} // ✅ pass user
        onProjectAdded={(newProj) => {
          setProjects(prev => [...prev, newProj]);
          showAlert("Project added successfully!");
        }}
      />

      <TodoModal
        show={showAddTodo}
        onHide={() => setShowAddTodo(false)}
        categories={categories}
        allProjects={projects}
        mode={editTodo ? 'edit' : 'add'}
        existingTodo={editTodo}
        user={user}
        refreshTodos={fetchTodos}
        onTodoAdded={() => showAlert("Todo added successfully!")}
      />

      <Button
        variant="primary"
        className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow"
        style={{ width: '60px', height: '60px' }}
        onClick={() => { setShowAddTodo(true); setEditTodo(null); }}
      >
        <FaPlus />
      </Button>

      <Footer />
    </div>
  );
};

export default TodosApp;
