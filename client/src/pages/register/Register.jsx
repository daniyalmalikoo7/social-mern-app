import { useRef } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // const { username, email, password, confirmPassword } = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">TREX-Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on TREX-Social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              required
              className="loginInput"
              ref={username}
            />
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              className="loginInput"
              ref={password}
            />
            <input
              placeholder="Confirm password"
              type="password"
              required
              className="loginInput"
              ref={confirmPassword}
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
