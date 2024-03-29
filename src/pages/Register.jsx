import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import AddAvatarImageURL from "../assets/addAvatar.png";
import "../styles/Forms.scss";

import { registerFirebaseUser, updateUserProfile } from "../../firebase/auth";
import { uploadResumableData } from "../../firebase/storage";
import { createUserChatDoc, createUserDoc } from "../../firebase/firestore";
import { activeChatUserAtom } from "../App";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("Add an avatar");
  const [_, setActiveChatUserAtom] = useAtom(activeChatUserAtom);
  setActiveChatUserAtom(null);

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
      const executeInEnd = () => navigate("/");
      const afterCompletionParams = { registeredUser, userName, executeInEnd };
      await uploadResumableData(
        avatar,
        uploadPath,
        afterCompletion,
        afterCompletionParams
      );
      // navigate back to home
    } catch (error) {
      console.error(error);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">QuackChat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" onChange={(e) => { console.log("e.files:", setFileName(e.target.files[0].name)) }} />
          <label htmlFor="file">
            <img src={AddAvatarImageURL} alt="" />
            <span>{fileName}</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span className="formError">{err}</span>}
        </form>
        <p  >
          You do have an account? <Link to="/login"
            style={{
              background: "#333",
              padding: "4px 8px",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px"
            }}
          >
            Login</Link>
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
  console.log("running afterCompletion with props: ", afterCompletionParams);
  const { executeInEnd, ...userInfo } = afterCompletionParams;
  const { registeredUser, downloadURL, userName } = userInfo;

  try {
    // update registered user photoURL & displayName
    await updateUserProfile(userInfo);

    //create user on firestore
    await createUserDoc(registeredUser);

    //create empty user chats on firestore
    await createUserChatDoc(registeredUser);

    executeInEnd();
  } catch (error) {
    console.log("🔴 Error!: ", error);
    // setError({state:true,code:error.code,message:error.message})
    throw new Error("❌Error executing afterCompletion callback❌", error);
  }
}
