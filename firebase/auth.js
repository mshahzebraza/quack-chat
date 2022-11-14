import { createUserWithEmailAndPassword } from "firebase/auth";
// creating the firebaseAuth here will throw errors. reason not know
import { firebaseAuth } from "./index.js";

export const registerFirebaseUser = async (
  email,
  password,
  onSuccess,
  onError,
  auth = firebaseAuth
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, // will automatically default to firebaseAuth
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
      throw new Error(`${errorCode}: ${errorMessage}`);
    }
  }
};
