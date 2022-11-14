import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddAvatarImageURL from "../assets/addAvatar.png";
import { registerFirebaseUser } from "../../firebase/auth";
import { uploadResumableData } from "../../firebase/storage";
import "../styles/Forms.scss";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // transform data
    const [userName, email, password, avatar] = destructureFormData(e.target);
    // register user
    const registeredUser = await registerFirebaseUser(email, password);

    // update user-profile: while registration, only email & password is accepted. Therefore, remaining fields are updated later
    const downloadURL = await uploadResumableData(
      avatar,
      createUploadPath(userName)
    );
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">React Chat App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={AddAvatarImageURL} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

function createUploadPath(userName) {
  const date = new Date().getTime();
  return `${userName}_${date}`;
}

function destructureFormData(formElem) {
  return [0, 1, 2, 3].map((valID) => {
    const input = formElem[valID];
    if (input.type === "file") return input.files[0];
    return formElem[valID].value;
  });
}
