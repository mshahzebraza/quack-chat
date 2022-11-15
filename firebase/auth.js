import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// creating the firebaseAuth here will throw errors. reason not know
import { firebaseAuth } from "./index.js";

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
