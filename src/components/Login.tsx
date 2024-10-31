import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the login logic
    // For this example, we'll just show an error if the fields are empty
    if (!email || !password) {
      setShowError(true);
    } else {
      setShowError(false);
      console.log('Login attempted with:', { email, password });
      // Handle login logic here
    }
  };

  return (
    <Container fluid className="h-100 bg-light d-flex align-items-center py-5">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <Card.Header className="bg-dark text-white text-center py-4">
              <h2 className="font-weight-light my-2">Login</h2>
            </Card.Header>
            <Card.Body className="px-5 py-4">
              {showError && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  Please fill in all fields.
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="dark" type="submit" size="lg">
                    Sign In
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div className="small">
                <a href="#" className="text-decoration-none">Forgot password?</a>
              </div>
              <div className="small mt-2">
                Don't have an account? <a href="#" className="text-decoration-none">Sign up!</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

