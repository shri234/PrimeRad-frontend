import { memo, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../services/auth";
import { loginSuccess, loginFailure } from "../../store/auth/actions";
import { selectAuthError } from "../../store/auth/selectors";
import "./Auth.css";

const LoginPage = memo(() => {
  const [identifier, setIdentifier] = useState(""); // can be email or mobile number
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await login(identifier, password);
      console.log(user, token);
      // Save to Redux
      dispatch(loginSuccess(user, token));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("username", user.name);

      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      dispatch(loginFailure(errorMsg));
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="auth-card">
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                {/* Email or Mobile Number */}
                <Form.Group className="mb-3" controlId="formBasicIdentifier">
                  <Form.Label>Email or Mobile Number</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter email or mobile number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                {/* Password */}
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
                      required
                    />
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Login
                </Button>

                <div className="text-center mb-3">
                  <span>Or</span>
                </div>

                <Button variant="danger" type="button" className="w-100 mb-3">
                  <i className="fab fa-google me-2"></i> Login with Google
                </Button>

                <div className="text-center">
                  <span>Don't have an account? </span>
                  <Link to="/register">Sign up</Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

LoginPage.displayName = "LoginPage";
export default LoginPage;
