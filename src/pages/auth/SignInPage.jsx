import { 
  browserLocalPersistence, 
  browserSessionPersistence, 
  setPersistence, 
  signInWithEmailAndPassword,
  signInWithPopup,
  getRedirectResult 
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';
import { saveUserToFirestore } from '../../utils/saveUserToFirestore';
import { auth, googleProvider, facebookProvider } from '../../firebase';
import { signInWithRedirect } from "firebase/auth";
import FacebookRedirectLogin from './FacebookRedirectLogin';
import HandleRedirectLogin from './HandleRedirectLogin';




const SignInPage = ({ setActive, setUser })  => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
   rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password, 
          rememberMe 
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

  

  const loginWithGoogle = async () => {
    // const navigate = useNavigate();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
      alert('Login successful!');
      // setActive("home");
      setUser(user);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // const FacebookRedirectLogin = () => {
    useEffect(() => {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            console.log("Redirect Login Success:", result.user);
            saveUserToFirestore(result.user);
            setUser(user);
          }
        })
        .catch((error) => {
          console.error("Redirect Login Error:", error);
        });
    }, []);

    const handleFacebookLogin = () => {
      signInWithRedirect(auth, facebookProvider);
    };

 // };

  const loginWithFacebookRedirect = () => {
    signInWithRedirect(auth, facebookProvider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect Facebook user:", result.user);
          saveUserToFirestore(result.user);
          setUser(user);
        }
      })
      .catch((error) => {
        console.error("Redirect Facebook login error:", error);
      });
  }, []);

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook login success:", result.user);
      await saveUserToFirestore(result.user);
      setUser(user);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Facebook login popup closed by user.");
      } else {
        console.error("Facebook login error:", error);
      }
    }
  };

  const loginWithFacebookk = () => {
    signInWithRedirect(auth, facebookProvider);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      // await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
       await setPersistence(auth, browserLocalPersistence);

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      alert('Login successful!');
      // redirect or other action can go here
      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });
      setUser(user);
      setActive("home");
      navigate("/");
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
            <h2 className="text-center mb-4">Sign In</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                   autoComplete="email"
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
                     autoComplete="current-password"
                    required
                  />
                  <Button variant="outline-secondary" onClick={toggleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputGroup>
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

              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
            <br/>
            <button onClick={loginWithGoogle}>Login with Google</button>
            <br/>
            <button onClick={loginWithFacebook}>Login with Facebook (not working)</button>

           {/* <br/>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>
            <br/>
            <button onClick={loginWithFacebookk}>Login with Facebook</button>
            <br/>
            <div style={{ textAlign: "center" }}>
              <h2>Sign in</h2>
               <FacebookRedirectLogin />
             <HandleRedirectLogin />  
            </div> */}
            
            <div className="text-center justify-content-center mt-2 pt-2">
            <p className="small fw-bold mt-2 pt-1 mb-0">
                Don't have an account ?&nbsp;
                
                <Link to='/sign-up' >
                <span
                // className="link-danger"
                style={{ 
                    textDecoration: "none", 
                    cursor: "pointer", 
                    color: 'green'
                }}
                >
                    Register
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

export default SignInPage;
