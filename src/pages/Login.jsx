import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Forms.scss";
import { authUserAtom, logInUser } from "../../firebase/auth";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted! 👍");
    const [email, password] = destructureFormData(e.target);
    await logInUser(email, password);
    navigate("/");
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">React Chat App: </span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button type="submit">Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;

function destructureFormData(formElem) {
  return [0, 1].map((valID) => {
    const input = formElem[valID];
    if (input.type === "file") return input.files[0];
    return formElem[valID].value;
  });
}
