import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link, useNavigate } from 'react-router-dom';

const NavbarHome = ({ active, setActive, user, handleLogout, role, search, handleChange }) => {

    const userId = user?.uid;

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search) {
        navigate(`/search?searchQuery=${search}`);
        } else {
        navigate("/");
        }
    };

  return (
    <div>
    <div  >
        <Navbar variant='dark' bg='dark' expand="lg" sticky='top' style={{ height: '55px' }}>
        <Container fluid>
            <Navbar.Brand href="/" style={{ fontFamily:'Oxygen'}}>
                MyNewApp
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className='icons' style={{justifyContent:'start'}}>
            
            <Nav className="me-auto">
            <Nav.Link href="/" >
            Home
            </Nav.Link>

            <Nav.Link >
                <Link 
                     style={{
                         color:'grey', 
                        textDecoration:'none',
                         marginTop:'8px',
                         width: '10px'
                     }}
                    to="/about-us"
                        >
                    AboutUs
                </Link>
            </Nav.Link>
            <NavDropdown title="Homes" id="navbarScrollingDropdown">
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-page" >Home One</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-alt" >Home Two</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-three" >Home Three</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-five" >Home Four</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-nine" >Home Five</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-news" >Home News</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-news-ui" >Home News UI</Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Link style={{ color:'black', textDecoration:'none',}} to="/home-news-page" >Home News Page</Link>
              </NavDropdown.Item>
            </NavDropdown>
            </Nav>
            
            <Nav style={{width:'420px', marginLeft:'10px', }}>
                
                {/*
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
                */}

                <InputGroup className="mt-2 mb-2"  >
                    
                    <form onSubmit={handleSubmit} className="form-group d-flex" style={{width:'400px'}} >
                        <input
                        type="text"
                        value={search}
                        className="form-control search-input"
                        placeholder="Search blog"
                        onChange={handleChange}
                        // aria-label="Search"
                        // aria-describedby="basic-addon1"
                    />
                        
                        <button className="btn btn-secondary search-btn">
                        <i className="fa fa-search" />
                        </button>
                    </form>
                    
                </InputGroup>

            </Nav>
            </Navbar.Collapse>

            <Navbar.Collapse className='icons' 
                style={{marginLeft:'120px',marginRight:'0px',justifyContent:'end'}}>
            <Nav className="me-auto">

            
            <Nav.Link >
                <Link 
                     style={{
                         color:'grey', 
                        textDecoration:'none',
                         marginTop:'8px',
                         width: '10px'
                     }}
                    to="/dashboard/user"
                        >
                    Me
                </Link>
            </Nav.Link>

            {/*     
            {role === "admin" && <Link to="/dashboard">Admin Dashboard</Link>}
            {role === "user" && <Link to="/user-home">My Page</Link>}
            {role === "guest" && (
                <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
                </>
            )}
            */}
            
            {
                userId ? ( 
                    <NavDropdown title= {user?.displayName} style={{marginRight:'0px'}} id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/add-blog">Create Blog</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/add-blog-post">Create Blog Post</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/all-blogs">All Blogs</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/blog-posts">All Blog Posts</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/upload-pdf">Add Book</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/" >
                            <Nav.Link style={{color:'black'}} href="/view/book">The Book</Nav.Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/" >
                            
                                <Nav.Link style={{ color: 'black' }} 
                                    href='/view-book'
                                   >
                                    View Book
                                </Nav.Link>
                         
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/">
                            <Nav.Link href="#" 
                                style={{color:'black'}}
                                onClick={handleLogout}
                            >
                            Logout
                        </Nav.Link>
                        </NavDropdown.Item>
                    </NavDropdown>
                ) : ( 
                    <NavDropdown title="User" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">
                            <Link 
                                style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                                to="/sign-in"
                                    >
                            Login
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action3">
                            <Link 
                                style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                                to="/sign-up"
                                    >
                            Register
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action4">
                            Another action
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">
                            Something else here
                        </NavDropdown.Item>
                    </NavDropdown>
                     ) 
            }

            
            {/*
                    userId ? ( 
                
                    <Nav>
                    <Nav.Link >
                        {user?.displayName}
                    </Nav.Link>
                    <Nav.Link href="#" 
                            onClick={handleLogout}
                    >
                        Logout
                    </Nav.Link>
                    </Nav>
                    ) : ( 
                    <Nav>
                    <Nav.Link >
                        @ 
                    </Nav.Link>
                
                        <Link 
                            style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                            to="/sign-in"
                                >
                        Login
                        </Link>
                        &nbsp;&nbsp;
                        <Link 
                            style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                            to="/sign-up"
                                >
                        Register
                        </Link>
                    
                    </Nav>
                
                    ) 
            */}
            

            </Nav>
            </Navbar.Collapse>

            <DropdownButton
            align="end"
            title="Dropdown end"
            id="dropdown-menu-align-end"
            >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="1">
                <Link 
                    style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                    to="/apps/notes"
                        >
                Notes App
                </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1">
                <Link 
                    style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                    to="/apps/todosapp"
                        >
                Todos App
                </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1">
                <Link 
                    style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                    to="/apps/todoapp"
                        >
                Todo App
                </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1">
                <Link 
                    style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                    to="/apps/taskboard"
                        >
                Task Manager App
                </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1">
                <Link 
                    style={{color:'grey', textDecoration:'none',marginTop:'8px'}}
                    to="/apps/create-task"
                        >
                Create Task App
                </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
            </DropdownButton>
            
        </Container>
        </Navbar>
    </div>
    </div>
  )
}

export default NavbarHome;