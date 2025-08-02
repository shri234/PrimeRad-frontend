import { memo, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../services/auth";
import { signupSuccess, signupFailure } from "../../store/auth/actions";
import { selectAuthError } from "../../store/auth/selectors";
import "./Auth.css";

const SignupPage = memo(() => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await signup(name, email, password);
      dispatch(signupSuccess(user, token));
      navigate("/");
    } catch (err) {
      dispatch(signupFailure(err));
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="auth-card">
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSignup}>
                <div className="position-relative">
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </div>
                <div className="position-relative">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div className="position-relative">
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </div>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Sign Up
                </Button>

                <div className="text-center">
                  <span>Already have an account? </span>
                  <Link to="/login">Log in</Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

SignupPage.displayName = "SignupPage";
export default SignupPage;
