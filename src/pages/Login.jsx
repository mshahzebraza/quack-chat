import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Forms.scss";
import { logInUser } from "../../firebase/auth";
import { activeChatUserAtom, authUserAtom } from "../App";
import { useAtom } from "jotai";

const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "shahzeb@gmail.com",
    password: 123456
  });
  const [isLoading, setIsLoading] = useState(false);

  // listens to auth status from firebase
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [_, setActiveChatUserAtom] = useAtom(activeChatUserAtom);
  setActiveChatUserAtom(null);

  useEffect(() => {
    console.log("🚀 ~ file: Login.jsx:24 ~ useEffect ~ authUser:", authUser)
    if (!!authUser?.displayName) {
      console.log(`You're already signed in as ${authUser.displayName}`);
      navigate("/");
    }
  }, [authUser?.displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const [email, password] = destructureFormData(e.target);
    try {
      await logInUser(email, password);
      console.log("signed IN")
      navigate("/");
      setIsLoading(false)
    } catch (error) {
      setErr(error.message);
      setIsLoading(false)
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">QuackChat: </span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={formInputs.email}
            onChange={({ target }) => setFormInputs(
              prev => ({ ...prev, email: target.value })
            )}
          />
          <input
            type="password"
            placeholder="password"
            value={formInputs.password}
            onChange={({ target }) => setFormInputs(
              prev => ({ ...prev, password: target.value })
            )}
          />
          <button type="submit">{isLoading ? "Loading ..." : "Sign in"}</button>
          {err && <span className="formError">{err}</span>}
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
