import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';




const SignUpPage = ({ setActive }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
   rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    rememberMe,
  } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      // Set auth persistence
      // await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await setPersistence(auth, browserLocalPersistence);

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const displayName = `${firstName} ${lastName}`;

      // Update profile
      await updateProfile(user, { displayName });

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        firstName,
        lastName,
        role,
        assignedTasks: [],
        createdTasks: [],
        notifications: [],
        createdAt: serverTimestamp()
      });

      alert('Account created successfully!');

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        rememberMe: false,
      });
      setActive("home");
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100" style={{ maxWidth: '500px' }}>
        <Col>
          <Card className="p-4 shadow-sm rounded">
            <h2 className="text-center mb-4">Sign Up</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                  <Button variant="outline-secondary" onClick={toggleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={role} onChange={handleChange}>
                  <option >Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="p-2 mb-3" controlId="rememberMe" style={{backgroundColor:'silver',borderRadius:'4px'}} >
                <Form.Check
                  type="checkbox"
                  label="Remember Me"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button disabled={loading} variant="primary" type="submit" className="w-100">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>
            <div className="text-center justify-content-center mt-2 pt-2">
            <p className="small fw-bold mt-2 pt-1 mb-0">
                Already have an account ?&nbsp;
                
                <Link to='/sign-in' >
                <span
                // className="link-success"
                style={{
                    textDecoration: "none",
                    cursor: "pointer",
                     color: "red",
                }}
                >
                    Login
                </span>
                </Link>
            </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
