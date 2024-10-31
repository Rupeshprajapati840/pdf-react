
import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Button, NavDropdown } from 'react-bootstrap';
 
export default function Footer({ }) {
    return (
        <footer className="bg-light mt-3 py-4">
            <Container>
                <Row>
                    <Col md={3}>
                        <h5>About Us</h5>
                        <p>We are a company dedicated to providing high-quality products and services to our customers.</p>
                    </Col>
                    <Col md={3}>
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Contact Us</h5>
                        <address>
                            <p>123 Main St.</p>
                            <p>Anytown, USA 12345</p>
                            <p>Email: info@example.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </address>
                    </Col>
                    <Col md={3}>
                        <h5>Newsletter</h5>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-2">
                                Subscribe
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <p>&copy; 2023 Your Company Name. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}