import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../context/apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  console.log(user);

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
              type="email"
              placeholder="Email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress sx={{ color: "white", size: "20px" }} />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
