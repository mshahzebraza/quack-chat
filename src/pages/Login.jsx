import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Forms.scss";
import { logInUser } from "../../firebase/auth";
import { activeChatUserAtom, authUserAtom } from "../App";
import { useAtom } from "jotai";

const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [_, setActiveChatUserAtom] = useAtom(activeChatUserAtom);
  setActiveChatUserAtom(null);

  useEffect(() => {
    if (!!authUser?.displayName) {
      alert(`You're already signed in as ${authUser.displayName}`);
      navigate("/");
    }
  }, [authUser?.displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [email, password] = destructureFormData(e.target);
    try {
      await logInUser(email, password);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    }
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
          <span>{err ? err : " "}</span>
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
        <Link to="/">Home</Link>
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
