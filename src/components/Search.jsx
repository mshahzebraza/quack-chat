import React, { useState } from "react";
import { useAtom } from "jotai";

import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Search.scss";
import "../styles/UserChat.scss";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseFireStoreDB } from "../../firebase";
import { authUserAtom } from "../../firebase/auth";

const Search = () => {
  const [searchUserName, setSearchUsername] = useState("");
  const [userMatch, setUserMatch] = useState(null);
  const [err, setErr] = useState(false);
  const [authUser] = useAtom(authUserAtom);

  // search the users collection against the document with matching username
  const handleSearch = async (e) => {
    // Create a reference to the users collection
    const usersRef = collection(firebaseFireStoreDB, "users");
    // Create a filter for the required user
    const queryFilter = where("displayName", "==", searchUserName);
    // Create a query against the collection.
    const q = query(usersRef, queryFilter);

    try {
      // Execute the Query
      const querySnapshot = await getDocs(q);
      // doc.data() is never undefined for query doc snapshots
      console.log(querySnapshot);

      // Check the results of query for null/empty
      if (!querySnapshot.size) alert("no user found");
      querySnapshot.forEach((doc) => {
        // set the userMatch to the returned document
        const docRes = doc.data();
        if (authUser.uid === docRes.uid) {
          console.error("Found yourself");
        } else {
          setUserMatch(doc.data());
        }
        console.log(doc.data());
      });
    } catch (error) {
      setErr("🔴 Error occurred during user search");
    }
  };
  const handleSelect = async () => {
    // Check the uid of the selected user
    const { displayName: nameAuth, uid: uidAuth } = authUser;
    const { displayName: nameMatch, uid: uidMatch } = userMatch;

    console.log("Auth user: ", nameAuth);
    console.log("Selected user: ", nameMatch);
    const comboId =
      uidAuth > uidMatch ? uidAuth + uidMatch : uidMatch + uidAuth;
    try {
      const docRef = doc(firebaseFireStoreDB, "chats", comboId);
      // Fetch the chatGroup for both users
      const docSnap = await getDoc(docRef);
      console.log("docSnap exists? ", docSnap.exists());
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");

        // Step 1: Create a combined chatGroup for both users in "chat" collection
        await setDoc(doc(firebaseFireStoreDB, "chats", comboId), {});
        // Step 2 & 3: Create a the data to show in the recent-chat-list in sidebar, in the "userChats" collection of both users. Each user will have a separate document in userChat collection, and each of the user-document will contain the chatGroup document for each of the people user has talked to

        // Update sender userChats for the receiver
        await updateDoc(doc(firebaseFireStoreDB, "userChats", authUser.uid), {
          [comboId + ".userInfo"]: {
            uid: userMatch.uid,
            displayName: userMatch.displayName,
            photoURL: userMatch.photoURL,
          },
          [comboId + ".date"]: serverTimestamp(),
        });
        // Update receiver userChats for the sender
        await updateDoc(doc(firebaseFireStoreDB, "userChats", userMatch.uid), {
          [comboId + ".userInfo"]: {
            uid: authUser.uid,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
          },
          [comboId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
      console.error("Error while selecting the searched user!");
    }
  };

  const handleKey = (e) => {
    if (!searchUserName) console.log("Reset the search Result");
    if (["Enter", "NumpadEnter"].includes(e.code)) {
      handleSearch();
      return null;
    }
    // search for user
  };

  return (
    <div className="search">
      <div className="searchForm">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setSearchUsername(e.target.value)}
          value={searchUserName}
        />
      </div>
      {/* Search Error */}
      {err && <span>User not found!</span>}
      {/* Search Results */}
      {userMatch && (
        <div className="userChat" onClick={handleSelect}>
          <img
            src={userMatch?.photoURL || fallbackImageURL}
            alt="Contact's Image"
          />
          <div className="userChatInfo">
            <span>{userMatch?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
