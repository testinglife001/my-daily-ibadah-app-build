// Sidebar.js
import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaInfoCircle, FaTachometerAlt, FaChevronDown,
  FaChevronRight, FaCog, FaList, FaFolder, FaLayerGroup
} from 'react-icons/fa';
// import { MdAppRegistration, MdApps  } from "react-icons/md"; 
// import { FcAndroidOs } from "react-icons/fc";
import { MdApps, MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import './DashboardSidebar.css';

const DashboardSidebar = ({ isExpanded, setIsExpanded }) => {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    categories:false,
    notes: false,
    settings: false,
    apps: false,
    managers: false,
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
      <div className="text-center mb-3">
        <button className="btn btn-sm btn-outline-light" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '☰' : '→'}
        </button>
      </div>

      <Nav className="flex-column">
        <Link to="/" className={`nav-link text-white ${isActive('/') && 'bg-secondary'}`}>
          <FaHome className="me-2" /> {isExpanded && 'Dashboard'}
        </Link>

        <Nav.Link
          onClick={() => toggleMenu('dashboard')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Dashboard'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.dashboard ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.dashboard}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/main" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Main Panel'}
              </Link>
              <Link to="/dashboard/stats" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Statistics'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Link to="/about" className={`nav-link text-white ${isActive('/about') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'About'}
        </Link>

        <Nav.Link
          onClick={() => toggleMenu('categories')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Category'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.categories ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.categories}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-category" className={`nav-link text-white ${isActive('/dashboard/all-category') && 'bg-secondary'}`}>
                {isExpanded && 'All Category'}
              </Link>
              <Link to="/dashboard/add-category" className={`nav-link text-white ${isActive('/dashboard/add-category') && 'bg-secondary'}`}>
                {isExpanded && 'Add Category'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('notes')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Notes'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.notes ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.notes}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/note" className={`nav-link text-white ${isActive('/dashboard/note') && 'bg-secondary'}`}>
                {isExpanded && 'Note'}
              </Link>
              <Link to="/dashboard/notes" className={`nav-link text-white ${isActive('/dashboard/notes') && 'bg-secondary'}`}>
                {isExpanded && 'All note'}
              </Link>
              <Link to="/dashboard/add-note" className={`nav-link text-white ${isActive('/dashboard/add-note') && 'bg-secondary'}`}>
                {isExpanded && 'Add note'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('managers')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaInfoCircle className="me-2" /> {isExpanded && 'Managers'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.managers ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.managers}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/category-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Category '}
              </Link>
              <Link to="/dashboard/category-manager-alt" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Category Alt'}
              </Link>
              <Link to="/dashboard/category-manager-ui" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Category UI'}
              </Link>
              <Link to="/dashboard/single-category-manager" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Single Category '}
              </Link>
              <Link to="/dashboard/single-subcategory-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Single Subcategory '}
              </Link>
              <Link to="/dashboard/item-manager" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Item '}
              </Link>
              <Link to="/dashboard/post-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Post '}
              </Link>
              <Link to="/dashboard/story-manager" className={`nav-link text-white ${isActive('/dashboard/story-manager') && 'bg-secondary'}`}>
                {isExpanded && 'Story '}
              </Link>
              <Link to="/dashboard/taskmanager" className={`nav-link text-white ${isActive('/dashboard/taskmanager') && 'bg-secondary'}`}>
                {isExpanded && 'Task App'}
              </Link>
              <Link to="" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'None'}
              </Link>
            </Nav>
          </div>
        </Collapse>


        <Nav.Link
          onClick={() => toggleMenu('apps')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <MdApps className="me-2" />  {isExpanded && 'Apps'}
            
          </span>
          {isExpanded && (openMenus.apps ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.apps}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
                {isExpanded && 'To Do List'}
              </Link>
              <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
                {isExpanded && 'Notes'}
              </Link>
            </Nav>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
                {isExpanded && 'Task Manager'}
              </Link>
              <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
                {isExpanded && 'Trello Clone'}
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
              <Link to="/dashboard/all-posts-list" className={`nav-link text-white ${isActive('/dashboard/all-posts-list') && 'bg-secondary'}`}>
                {isExpanded && 'All Post List'}
              </Link>
              <Link to="/dashboard/all-posts-view" className={`nav-link text-white ${isActive('/dashboard/all-posts-view') && 'bg-secondary'}`}>
                {isExpanded && 'Add Post View'}
              </Link>
              <Link to="/dashboard/add-post" className={`nav-link text-white ${isActive('/dashboard/add-post') && 'bg-secondary'}`}>
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
              <Link to="/dashboard/all-post" className={`nav-link text-white ${isActive('/dashboard/all-post') && 'bg-secondary'}`}>
                {isExpanded && 'All Post'}
              </Link>
              <Link to="/dashboard/posts" className={`nav-link text-white ${isActive('/dashboard/posts') && 'bg-secondary'}`}>
                {isExpanded && 'Posts'}
              </Link>
            </Nav>
          </div>
        </Collapse>


        <Nav.Link
          onClick={() => toggleMenu('settings')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaCog className="me-2" /> {isExpanded && 'Settings'}
          </span>
          {isExpanded && (openMenus.settings ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.settings}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/settings/profile" className={`nav-link text-white ${isActive('/settings/profile') && 'bg-secondary'}`}>
                {isExpanded && 'Profile'}
              </Link>
              <Link to="/settings/security" className={`nav-link text-white ${isActive('/settings/security') && 'bg-secondary'}`}>
                {isExpanded && 'Security'}
              </Link>
            </Nav>
          </div>
        </Collapse>
      </Nav>
    </div>
  );
};

export default DashboardSidebar;
