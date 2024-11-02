import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass } from "../../config/firebase";
import { toast } from "react-toastify";

const Login = () => {
  const [currState, setCurrState] = useState("login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault(); //prevent page reload when submit form
    if (currState === "Sign Up" && !termsChecked) {
      toast.error("You must agree to the terms and privacy policy.", {
        position: "top-center",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (currState === "Sign Up") {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState === "Sign Up" ? "Sign Up" : "Login"}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email adress"
          className="form-input"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="password"
          className="form-input"
          required
        />
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        {currState === "Sign Up" && (
          <div className="login-term">
            <input
              type="checkbox"
              checked={termsChecked}
              onClick={(e) => setTermsChecked(e.target.checked)}
            />
            <p>
              I agree to the <span>terms of use & privacy policy.</span>
            </p>
          </div>
        )}

        <div className="login-forgot">
          {currState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account?{" "}
              <span onClick={() => setCurrState("login")}>Login Here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account{" "}
              <span onClick={() => setCurrState("Sign Up")}> Click Here</span>
            </p>
          )}
          {currState === "login" ? (
            <p className="login-toggle">
              Forgot Password ?
              <span onClick={() => resetPass(email)}> Reset Here</span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
