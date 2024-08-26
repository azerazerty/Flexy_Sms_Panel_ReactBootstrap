import React, { useContext, useState } from "react";
import { Col, Row, Form, Image, FloatingLabel } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Logo from "../assets/Logo1.png";
import axios, { AxiosResponse } from "axios";
import { AuthContext } from "./Auth";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
  const [user, setUser] = useContext(AuthContext);
  if (user) return <Navigate to="/" />;

  const [errorLogin, setErrorLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (username.length < 2 || password.length < 2) return;

    setIsLoading(true);

    let error;
    axios
      .post(`${BASE_URL}/login.php`, {
        username,
        password,
      })
      .then(async (response: AxiosResponse) => {
        if (response.data.status !== "success")
          throw new Error(`${response.data.message}`);
        let user = {
          username: username,
          token: response.data.auth_token,
          phone: "0" + response.data.phone_number,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsLoading(false);
      })
      .catch((e) => {
        error = e;
        setErrorLogin(true);
        setIsLoading(false);
      });
    if (error) throw new Error(error);
    return;
  };

  return (
    <>
      <Helmet>
        <title>Login | Flexy Panel</title>
      </Helmet>
      <Row
        style={{ backgroundColor: "hsl(0deg 47.35% 97.83%)" }}
        className="px-4 py-5 py-md-5 px-md-5 align-items-center text-center text-lg-start"
      >
        <Col className="d-none d-lg-block col-lg-6 mb-5 mb-lg-0">
          <div className="login-right">
            <h1 className="text-center fw-bold  my-4 my-md-5 display-3">
              Ich7en <span className="text-primary">Panel</span>
            </h1>
            <p
              className="text-center"
              style={{ color: "hsl(217, 10%, 50.8%)" }}
            >
              To Register An Account , Reach Out To Us :{" "}
              <span>
                <a
                  style={{ textDecoration: "none" }}
                  href="https://wa.me/213659791718"
                  target="blank"
                >
                  Send Message On Whatsapp
                </a>
              </span>
            </p>
          </div>
        </Col>
        <Col>
          <Card>
            <Card.Body className=" text-center  py-5 px-md-5">
              <Form noValidate onSubmit={handleSubmit}>
                <Image className="mb-4" src={Logo} alt="" height="72" />
                <h1 className="h6 mb-3">
                  If you have an account, please sign in
                </h1>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Username"
                  className="mb-3"
                >
                  <Form.Control
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    isInvalid={errorLogin}
                  />
                </FloatingLabel>
                <FloatingLabel
                  className="mb-3"
                  controlId="floatingPassword"
                  label="Password"
                >
                  <Form.Control
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    isInvalid={errorLogin}
                  />
                  <Form.Control.Feedback type="invalid">
                    Incorrect Username or Password
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Form.Control
                  disabled={isLoading}
                  className="btn btn-primary btn-lg mt-3"
                  type="submit"
                  value={`${!isLoading ? "Login" : " Logging Please Wait..."}`}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Login;
