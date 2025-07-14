// SidebarAlt.jsx
import React, { useEffect, useState } from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { FaFolder, FaInbox, FaPlus, FaCalendarDay, FaCalendarWeek, FaList } from 'react-icons/fa';
import { fetchCategories, fetchProjectsByCategory } from '../../../utils/todosapp';


const SidebarAlt = ({
  user,
  onSelectProject,
  onFilterSelect,
  onAddCategory,
  onAddProject,
  selectedView, 
  setSelectedView, 
  setSelectedProject,
  // onSelectProject
}) => {
  const [categories, setCategories] = useState([]);
  const [projectsByCategory, setProjectsByCategory] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch categories and initial projects
  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return; // Ensure user is available

      const cats = await fetchCategories(user.uid);
      setCategories(cats);

      const allProjects = {};
      for (const cat of cats) {
        if (!cat.id) continue; // prevent invalid query
        const projs = await fetchProjectsByCategory(cat.id, user.uid);
        allProjects[cat.id] = projs;
      }
      setProjectsByCategory(allProjects);
    };

    load();
  }, [user]);


  // console.log(categories);

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  return (
    <div className="todosapp-sidebar p-3 border-end bg-light" style={{ height: '100vh', overflowY: 'auto' }}>
      <h5 className="d-flex justify-content-between align-items-center">
        Filters
      </h5>
      {/*<Nav className="flex-column mb-4">
        <Nav.Link onClick={() => onFilterSelect('inbox')}>
          <FaInbox className="me-2" /> Inbox
        </Nav.Link>
        <Nav.Link onClick={() => onFilterSelect('today')}>
          <FaCalendarDay className="me-2" /> Today
        </Nav.Link>
        <Nav.Link onClick={() => onFilterSelect('week')}>
          <FaCalendarWeek className="me-2" /> This Week
        </Nav.Link>
        <Nav.Link onClick={() => onFilterSelect('all')}>
          <FaList className="me-2" /> All Todos
        </Nav.Link>
      </Nav>*/}

      
      {<Nav defaultActiveKey="/inbox" className="flex-column bg-light  p-2" // style={{width: '250px'}}
        >
        <Nav.Link 
            active={selectedView === 'Inbox'} 
            onClick={() => { setSelectedView('Inbox'); setSelectedProject(null); }}
        >
            Inbox
        </Nav.Link>
        <Nav.Link 
            active={selectedView === 'Today'} 
            onClick={() => { setSelectedView('Today'); setSelectedProject(null); }}
        >
            Today
        </Nav.Link>
        <Nav.Link 
            active={selectedView === 'Week'} 
            onClick={() => { setSelectedView('Week'); setSelectedProject(null); }}
        >
            This Week
        </Nav.Link>
        <Nav.Link 
            active={selectedView === 'AllTodos'} 
            onClick={() => { setSelectedView('AllTodos'); setSelectedProject(null); }}
        >
            All Todos
        </Nav.Link>
       
        <Nav.Link 
            active={selectedView === 'ProjectTodos'} 
            onClick={() => { 
            setSelectedView('ProjectTodos'); 
            setSelectedProject('project-id-example'); // You'd pass selected project id here 
            }}
        >
            Example Project
        </Nav.Link>
        </Nav>}
      

      <h5 className="d-flex justify-content-between align-items-center">
        Categories
        {/*<FaPlus
          onClick={onAddCategory}
          style={{ cursor: 'pointer' }}
          title="Add Category"
        />*/}
      </h5>

      <Nav className="flex-column">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat.id}>
              <div
                className="d-flex justify-content-between align-items-center px-2 py-1"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleCategory(cat.id)}
              >
                <span><FaFolder className="me-2" /> {cat.title}</span>
                {/*<FaPlus
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddProject(cat.id);
                  }}
                  title="Add Project"
                  style={{ cursor: 'pointer' }}
                />*/}
              </div>

              <Collapse in={expandedCategories[cat.id]}>
                <div>
                  {projectsByCategory[cat.id]?.map((proj) => (
                    <Nav.Link
                        key={proj.id}
                        onClick={() => {
                            setSelectedView('ProjectTodos');
                            setSelectedProject(proj.id);
                        }}
                        className="ms-4"
                        >
                        • {proj.name}
                    </Nav.Link>
                    
                  ))}
                </div>
              </Collapse>
            </div>
          ))
        ) : (
          <div className="text-muted ps-2">No categories found</div>
        )}
      </Nav>
    </div>
  );
};

export default SidebarAlt;
