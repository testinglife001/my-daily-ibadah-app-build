// components/Sidebar.js
import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaInfoCircle, FaTachometerAlt, FaChevronDown,
  FaChevronRight, FaCog, FaBars
} from 'react-icons/fa';
import './DashboardSidebarUI.css';


 const DashboardSidebarUI = ({ isExpanded, setIsExpanded }) => {

  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    settings: false,
    categories: false,
    post: false,
    posts: false,
  });

  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className={`sidebar p-2 ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
      style={{marginLeft:'0'}}
    >   
    {/*
      <div className="text-center mb-3">
        <button
          className="btn btn-sm btn-outline-light w-100 d-flex justify-content-center align-items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaBars className="me-2" />
          {isExpanded && 'Toggle Menu'}
        </button>
      </div>
    */}

      <Nav className="flex-column">

        <Link to="/dashboardui" className={`nav-link text-white ${isActive('/dashboardui/about') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'Dashboard'}
        </Link>

        <Link to="/dashboardui/home" className={`nav-link text-white ${isActive('/dashboardui/home') && 'bg-secondary'}`}>
          <FaHome className="me-2" /> {isExpanded && 'Home'}
        </Link>

        <Link to="/dashboardui/about" className={`nav-link text-white ${isActive('/dashboardui/about') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'About'}
        </Link>

        <Nav.Link  className="text-white d-flex justify-content-between align-items-center">
          <span>
            <Link to="/dashboardui/demo" className={`nav-link text-white ${isActive('/dashboardui/demo') && 'bg-secondary'}`}>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Demo'}
            </Link>
          </span>
        </Nav.Link>
        
        <Nav.Link onClick={() => toggleMenu('dashboard')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Dashboard'}
          </span>
          {isExpanded && (openMenus.dashboard ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.dashboard}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboardui/main" className={`nav-link text-white ${isActive('/dashboardui/main') && 'bg-secondary'}`}>
                {isExpanded && 'Main Panel'}
              </Link>
              <Link to="/dashboardui/stats" className={`nav-link text-white ${isActive('/dashboardui/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Stats Panel'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('categories')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Category'}
          </span>
          {isExpanded && (openMenus.categories ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.categories}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboardui/all-category" className={`nav-link text-white ${isActive('/dashboardui/all-category') && 'bg-secondary'}`}>
                {isExpanded && 'All Category'}
              </Link>
              <Link to="/dashboardui/add-category" className={`nav-link text-white ${isActive('/dashboardui/add-category') && 'bg-secondary'}`}>
                {isExpanded && 'Add Category'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('post')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Post'}
          </span>
          {isExpanded && (openMenus.post ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.post}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboardui/all-posts-list" className={`nav-link text-white ${isActive('/dashboardui/all-posts-list') && 'bg-secondary'}`}>
                {isExpanded && 'All Post List'}
              </Link>
              <Link to="/dashboardui/all-posts-view" className={`nav-link text-white ${isActive('/dashboardui/all-posts-view') && 'bg-secondary'}`}>
                {isExpanded && 'Add Post View'}
              </Link>
              <Link to="/dashboardui/add-post" className={`nav-link text-white ${isActive('/dashboardui/add-post') && 'bg-secondary'}`}>
                {isExpanded && 'Add Post'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('posts')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Post Manager'}
          </span>
          {isExpanded && (openMenus.posts ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.posts}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboardui/all-post" className={`nav-link text-white ${isActive('/dashboardui/all-post') && 'bg-secondary'}`}>
                {isExpanded && 'All Post'}
              </Link>
              <Link to="/dashboardui/posts" className={`nav-link text-white ${isActive('/dashboardui/posts') && 'bg-secondary'}`}>
                {isExpanded && 'Posts'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('settings')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaCog className="me-2" /> {isExpanded && 'Settings'}
          </span>
          {isExpanded && (openMenus.settings ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.settings}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboardui/profile" className={`nav-link text-white ${isActive('/dashboardui/profile') && 'bg-secondary'}`}>
                {isExpanded && 'Profile'}
              </Link>
              <Link to="/dashboardui/security" className={`nav-link text-white ${isActive('/dashboardui/security') && 'bg-secondary'}`}>
                {isExpanded && 'Security'}
              </Link>
            </Nav>
          </div>
        </Collapse>
      </Nav>
    </div>
  );
};

export default DashboardSidebarUI;
