import {
  createUserWithEmailAndPassword, // to sign up
  updateProfile, // to update user's info beyond than signup-only info
  signInWithEmailAndPassword,
  signOut, // to track the logging in / logging out
} from "firebase/auth";
// creating the firebaseAuth here will throw errors. reason not know
import { firebaseAuth } from "./index.js";
import { atom } from "jotai";

// Creating a new Authentication Atom State
export const authUserAtom = atom(true);

/**
 * Create a user based on email/password entered and handle the success/failure scenarios
 * @param  {string} email
 * @param  {string} password
 * @param  {Function?} onSuccess
 * @param  {Function?} onError
 */

export const registerFirebaseUser = async (
  email,
  password,
  onSuccess,
  onError
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth, // will automatically default to firebaseAuth
      email,
      password
    );
    // Signed in
    const user = userCredential.user;
    // run the default onSuccess if onSuccess is not defined
    if (!!onSuccess) {
      onSuccess(user);
    } else {
      console.log("👍 New User Created: ", user);
      return user;
    }
    // ...
  } catch (error) {
    // run the default onError if onError is not defined
    if (!!onError) {
      onError(error.code, error.code);
    } else {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("🔴 Error!: ", `${errorCode}: ${errorMessage}`);
      throw new Error(`❌ Error updating userProfile`);
    }
  }
};

/**
 * update registered user photoURL
 * @param  {Object} afterCompletionParams - collection of parameters needed to call the afterCompletion callback (runs after upload task)
 */
export const updateUserProfile = async (afterCompletionParams) => {
  const { registeredUser, userName, downloadURL } = afterCompletionParams;
  console.log("afterCompletionParams: ", afterCompletionParams);
  try {
    await updateProfile(registeredUser, {
      displayName: userName,
      photoURL: downloadURL,
    });
    console.log("✅ Profile Updated!");
  } catch (error) {
    console.log("🔴 Error!: ", error);
    // setError({state:true,code:error.code,message:error.message})
    throw new Error("❌ Error updating userProfile");
  }
};

/**
 * Logs the user out of firebase
 */
export async function logOutUser() {
  try {
    await signOut(firebaseAuth);
    console.log("✅ User Logged out!");
  } catch (error) {
    console.error(error.message);
    throw new Error("🔴 Error logging out the user!");
  }
}

/**
 * Log the user into firebase authentication
 * @param {string} email email input from login form
 * @param {string} password password input from login form
 */
export async function logInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    // Signed in
    const user = userCredential.user;
    console.log("✅User signed in!", user);
  } catch (error) {
    console.error(error.message);
    throw new Error("🔴 Error logging in the user!");
  }
}
