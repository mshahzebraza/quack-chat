import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AddAvatarImageURL from "../assets/addAvatar.png";
import "../styles/Forms.scss";

import { registerFirebaseUser, updateUserProfile } from "../../firebase/auth";
import { uploadResumableData } from "../../firebase/storage";
import { createUserChatDoc, createUserDoc } from "../../firebase/firestore";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    /**
     * Tasks:
     * 1. create a auth user to firebaseAuth (returns "new-user")
     * 2. upload the image for user to firebaseStorage against the submitted userName (returns "download-url")
     * 3. update the photoURL of "new-user" with the "download-url"
     * 4. create a new user in another database with the submitted information as auth db can only be used for login
     * 5. create an empty chat collection against the new user
     * 6. navigate to home
     */
    setLoading(true);
    e.preventDefault();
    // transform data
    const [userName, email, password, avatar] = destructureFormData(e.target);
    try {
      // Task 1: register user
      const registeredUser = await registerFirebaseUser(email, password);

      // Task 2-5: update user-profile: while registration, only email & password is accepted. Therefore, remaining fields are updated later
      const uploadPath = createUploadPath("userImages/" + userName);
      const afterCompletionParams = { registeredUser, userName };
      await uploadResumableData(
        avatar,
        uploadPath,
        afterCompletion,
        afterCompletionParams
      );
      // navigate back to home
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
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
          {err && <span>{err}</span>}
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
/**
 * Run at completion of upload task and gets access to download URL as well
 * The parameters are passed down from uploadResumableData->onCompletion
 * @param {Object} afterCompletionParams - collection of user-defined params for execution of function.
 * @param {Object} afterCompletionParams.registeredUser - user just created in authentication
 * @param {URL} afterCompletionParams.downloadURL - url of just uploaded profile picture
 * @param {string} afterCompletionParams.userName - name of the user from the form input
 */
async function afterCompletion(afterCompletionParams) {
  const { registeredUser, downloadURL, userName } = afterCompletionParams;

  try {
    // update registered user photoURL & displayName
    await updateUserProfile(afterCompletionParams);

    //create user on firestore
    await createUserDoc(registeredUser);

    //create empty user chats on firestore
    await createUserChatDoc(registeredUser);
  } catch (error) {
    console.log("🔴 Error!: ", error);
    // setError({state:true,code:error.code,message:error.message})
    throw new Error("❌Error executing afterCompletion callback❌", error);
  }
}
