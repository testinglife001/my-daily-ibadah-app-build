import React from 'react';
import { Navbar as RBNavbar, Container } from 'react-bootstrap';

function Navbar() {
  return (
    <RBNavbar bg="dark" variant="dark">
      <Container>
        <RBNavbar.Brand>Task Manager</RBNavbar.Brand>
      </Container>
    </RBNavbar>
  );
}

export default Navbar;
