// components/Navbar.js
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

const DashboardNavbarUI = ({ toggleSidebar }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" style={{ zIndex: 1050 }}>
      <Container fluid>
        {/* Hamburger toggle always visible */}
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          className="me-2"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FaBars />
        </Button>

        <Navbar.Brand href="/" className="fw-bold">
          My App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardNavbarUI;
