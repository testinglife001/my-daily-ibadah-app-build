import { Navbar, Nav, Container } from 'react-bootstrap';

const NavbarComponent = () => (
  <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
    <Container>
      <Navbar.Brand href="#">NewsPortal</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="ms-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">World</Nav.Link>
          <Nav.Link href="#">Politics</Nav.Link>
          <Nav.Link href="#">Sports</Nav.Link>
          <Nav.Link href="#">Tech</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavbarComponent;
