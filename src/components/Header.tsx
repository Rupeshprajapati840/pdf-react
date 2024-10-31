import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Button, NavDropdown } from 'react-bootstrap';

 
interface LoginProps {
  name: string; 
  isAuthenticated:boolean;
  setIsAuthenticated: (value: boolean) => void;  // Accepts a boolean
}


export default function Header({isAuthenticated,setIsAuthenticated,name}:LoginProps) {
 
  const handleLogin = () => {
    setIsAuthenticated(true)
  };

  const handleLogout = () => {
    setIsAuthenticated(false)
  }; 

  return (<Navbar  expand="lg" className="mb-3">
    <Container>
      <Navbar.Brand href="/">Pdf Viewer</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/services">Services</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
          <Nav.Link href="/viewer">Viewer</Nav.Link>
        </Nav>
        <Nav>
          {isAuthenticated ? (
            <>
              <NavDropdown title={`Welcome, ${name}`} id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <>
              <Nav.Link href="/login" onClick={handleLogin}>Login</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>)
}