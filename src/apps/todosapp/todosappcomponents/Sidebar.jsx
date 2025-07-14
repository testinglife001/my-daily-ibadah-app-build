// src/components/Sidebar.js
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ListGroup, Nav, Button } from 'react-bootstrap';
import { FaInbox, FaCalendarDay, FaCalendarWeek, FaList, FaListUl, FaPlus,  FaFolder, FaFolderOpen } from 'react-icons/fa';
import { db } from '../../../firebase';
import ProjectDropdown from './ProjectDropdown';
import CategoryProjects from './CategoryProjects';


function Sidebar({ 
   categories = [], 
  projects = [], 
  onViewChange, 
  onCategorySelect, 
  onProjectSelect,
  onShowAddCategory,
  onShowAddProject,
  setShowAddCategory,
  setShowAddProject,
  setShowAddTodo,
  fetchProjectsByCategory,

  mvcategories,
  mvprojects,
  mvselectedCategory,
  setMVSelectedCategory,
  setMVSelectedProjectId
}) {

  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

   const [cats, setCats] = useState([]); // ✅ initialize as array
   // const [projectsByCategory, setProjectsByCategory] = useState({});

   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
   const [projectsByCategory, setProjectsByCategory] = useState([]);

  /*
   const [mvcategories, setMVCategories] = useState([]);
  const [mvprojects, setMVProjects] = useState([]);
  const [mvtodos, setMVTodos] = useState([]);
  const [mvselectedCategory, setMVSelectedCategory] = useState('');
  const [mvselectedProjectId, setMVSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchDataMV = async () => {
      // const db = getFirestore(app);
      const catSnap = await getDocs(collection(db, 'categories'));
      const projSnap = await getDocs(collection(db, 'projects'));
      const todoSnap = await getDocs(collection(db, 'todos'));

      setMVCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMVProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMVTodos(todoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDataMV();
  }, []);
  */

   useEffect(() => {
    if (selectedCategoryId) {
      fetchProjectsByCategory(selectedCategoryId).then(setProjectsByCategory);
     }
   }, [selectedCategoryId]);


  useEffect(() => {
    // const db = getFirestore();

    const unsubCategories = onSnapshot(collection(db, 'categories'), snap => {
      const fetchedCategories = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCats(fetchedCategories); // ✅ now it's a valid array
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), snap => {
      const projects = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group projects by category
      // const grouped = {};
      // projects.forEach(proj => {
      //  const cat = proj.category || 'Uncategorized';
      //  if (!grouped[cat]) grouped[cat] = [];
      //  grouped[cat].push(proj);
      // });

    const projectsByCategory = Array.isArray(projects)
        ? projects.filter((proj) => proj.categoryId === expandedCategoryId)
        : [];



    //  setProjectsByCategory(grouped);
    setProjectsByCategory(fetchProjectsByCategory)
    
    });

    return () => {
      unsubCategories();
      unsubProjects();
    };
  }, []);
  


  const handleCategoryClick = (categoryId) => {
    setExpandedCategoryId(prev => prev === categoryId ? null : categoryId);
    setSelectedCategoryId(categoryId); // triggers useEffect to fetch projects
    onViewChange('category');
    onCategorySelect(categoryId);
  };

  const handleProjectClick = (projectId) => {
    onViewChange('project');
    onProjectSelect(projectId);
  };

  // const toggleCategory = (catId) => {
  //  setExpandedCategoryId(prev => prev === catId ? null : catId);
  //  onCategorySelect(catId);
  // };

  return (


    <div className="todosapp-sidebar border-end p-3 bg-light" 
        // style={{ width: "220px", height: "50%"}}
        >
        
      <div 
          // className="overflow-auto" 
          //style={{maxWidth: '300px', maxHeight: '600px'}} 
        >
      
      <h5 className="mb-3">Navigation</h5>

      

      <Nav className="flex-column">
        <Nav.Link onClick={() => onViewChange('inbox')}>
          <FaInbox className="me-2" /> Inbox
        </Nav.Link>
        <Nav.Link onClick={() => onViewChange('today')}>
          <FaCalendarDay className="me-2" /> Today
        </Nav.Link>
        <Nav.Link onClick={() => onViewChange('week')}>
          <FaCalendarWeek className="me-2" /> This Week
        </Nav.Link>
        <Nav.Link onClick={() => onViewChange('all')}>
          <FaListUl className="me-2" /> All Todos
        </Nav.Link>
        {/*<Nav.Link onClick={() => setView('all')}>
            <FaListUl className="me-2" /> All Todos
        </Nav.Link>*/}
      </Nav>

      <hr />



      <div className="d-flex justify-content-between align-items-center mb-2">
        <b className="text-muted mb-0">Categories</b>
        <div style={{ cursor: 'pointer' }}>
            
            <Button
                size="sm"
                variant="outline-primary"
                className="mt-2 d-flex align-items-center"
                onClick={() => setShowAddCategory(true)}
            >
                <FaPlus className="m-1" /> {/* Category */}
            </Button>
        </div>

      </div>


        {/* <Nav className="flex-column mt-3">
          
          <div 
            className="overflow-auto" 
            style={{maxWidth: '300px', maxHeight: '100px'}}  
            >
      
            
            </div>
        </Nav>

        <Nav className="flex-column mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-bold small text-muted">Projects</div>
            <div style={{ cursor: 'pointer' }}>
            
            <Button
                size="sm"
                variant="outline-primary"
                className="mt-2 d-flex align-items-center"
                onClick={() => setShowAddProject(true)}
            >
                <FaPlus className="me-2" /> Add Project
            </Button>
          </div>
          </div>
            <div 
            className="overflow-auto" 
            style={{maxWidth: '300px', maxHeight: '100px'}}  
            >
            {Array.isArray(projectsByCategory) && projectsByCategory.map((proj) => (
            <Nav.Link
                key={proj.id}
                onClick={() => handleProjectClick(proj.id)}
                className="ms-3"
            >
                <FaTasks className="me-2" />
                {proj.name}
            </Nav.Link>
            ))}


            
            </div>

            <Button className="m-3" onClick={() => setShowAddTodo(true)}>+ Add Todo</Button>
        </Nav>*/}

        {<div className="border-bottom">
          <ProjectDropdown
            categories={mvcategories}
            selectedCategory={mvselectedCategory}
            setSelectedCategory={setMVSelectedCategory}

          />
          <CategoryProjects
            projects={mvprojects}
            selectedCategory={mvselectedCategory}
            onSelectProject={setMVSelectedProjectId}
            onShowAddProject={onShowAddProject}
            setShowAddProject={setShowAddProject}
          />
        </div>}
            
        
      </div>      

    </div>
  );
}

export default Sidebar;
