import { doc, setDoc } from "firebase/firestore";
import { firebaseFireStoreDB } from "./";
import { atom } from "jotai";

/**
 * Contains uid, displayName, photoURL
 * @param  {Object} null
 */
export const activeChatUserAtom = atom(null);

export const createUserDoc = async (userData) => {
  const { uid, displayName, email, photoURL } = userData;
  try {
    const createdUserDoc = await setDoc(
      doc(firebaseFireStoreDB, "users", uid),
      {
        uid: uid,
        displayName,
        email,
        photoURL,
      }
    );
    console.log("🧑 Created the User Doc in firestore! 🔥");
    return createdUserDoc;
  } catch (error) {
    console.log("🔴 Error!: ", error);
    // setError({state:true,code:error.code,message:error.message})
    throw new Error("❌ Error creating UserDoc");
  }
};

export const createUserChatDoc = async (userData) => {
  try {
    const createdUserChatDoc = await setDoc(
      doc(firebaseFireStoreDB, "userChats", userData.uid),
      {}
    );
    console.log("💬 Created the User Chat Doc in firestore! 🔥");
    return createdUserChatDoc;
  } catch (error) {
    console.log("🔴 Error!: ", error);
    // setError({state:true,code:error.code,message:error.message})
    throw new Error("❌ Error creating UserChatDoc");
  }
};
