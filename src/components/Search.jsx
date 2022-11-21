import React, { useState } from "react";
import { useAtom } from "jotai";
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

import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Search.scss";
import "../styles/UserChat.scss";
import { firebaseFireStoreDB } from "../../firebase";
import { authUserAtom } from "../../firebase/auth";
import { createChatId } from "../lib/helpers";

const Search = () => {
  const [searchUserName, setSearchUsername] = useState("");
  const [usersMatched, setUsersMatched] = useState([]);
  const [err, setErr] = useState(false);
  const [authUser] = useAtom(authUserAtom);

  // search the users collection against the document with matching username
  const handleSearch = async (e) => {
    setErr(false);
    setUsersMatched(null);
    // Create a reference to the users collection
    const usersRef = collection(firebaseFireStoreDB, "users");
    // Create a filter for the required user
    const queryFilter = where("displayName", "==", searchUserName);
    // Create a query against the collection.
    const q = query(usersRef, queryFilter);

    try {
      // Execute the Query
      const querySnapshot = await getDocs(q);
      // Check the results of query for null/empty
      if (querySnapshot.size) {
        const matchingUsers = querySnapshot.docs.map((doc) => doc.data());
        // Filter out the logged in user from the search
        const filteredUsers = matchingUsers.filter(
          (user) => user.uid !== authUser.uid
        );

        setUsersMatched(filteredUsers);
      } else {
        setErr("No user found!");
      }
    } catch (error) {
      console.error(error);
      setErr("🔴 Error creating Chat Group/User Info!");
    }
  };
  // Select a user from the list of user search results
  const handleSelect = async (matchIdx) => {
    // Check the uid of the selected user
    const { displayName: nameA, uid: uidA, photoURL: photoA } = authUser;
    const {
      displayName: nameM,
      uid: uidM,
      photoURL: photoM,
    } = usersMatched[matchIdx];
    const comboId = createChatId(uidA, uidM);
    try {
      // Step 1: Check if the ChatGroup exists
      const docSnap = await getDoc(doc(firebaseFireStoreDB, "chats", comboId));

      if (docSnap.exists()) {
        console.log("Chat Group Already exists", docSnap.data());
      } else {
        console.log("Chat Group didn't exist! Creating ...");
        // Step 1-A: Create a combined chatGroup for both users in "chat" collection
        await setDoc(doc(firebaseFireStoreDB, "chats", comboId), {
          messages: [],
        });
        console.log("Chat Group Created");

        // Step 1-B: Update sender userChats for the receiver
        await updateDoc(doc(firebaseFireStoreDB, "userChats", uidA), {
          [comboId + ".userInfo"]: {
            uid: uidM,
            displayName: nameM,
            photoURL: photoM,
          },
          [comboId + ".date"]: serverTimestamp(),
        });
        console.log(`User Info created for ${nameM} in ${nameA}'s userChats`);

        // Step 1-C: Update receiver userChats for the sender
        await updateDoc(doc(firebaseFireStoreDB, "userChats", uidM), {
          [comboId + ".userInfo"]: {
            uid: uidA,
            displayName: nameA,
            photoURL: photoA,
          },
          [comboId + ".date"]: serverTimestamp(),
        });
        console.log(`User Info created for ${nameA} in ${nameM}'s userChats`);
      }
      // Step 2: Reset the search bar again
      setUsersMatched(null);
    } catch (error) {
      console.error(error);
      setErr("Error while selecting the searched user!");
    }
  };

  // Trigger an api request if "Enter" key is pressed
  const handleKey = (e) => {
    if (!searchUserName && !!usersMatched) {
      console.log("Reset the search Result!");
      setUsersMatched(null);
    }
    if (["Enter", "NumpadEnter"].includes(e.code)) {
      handleSearch();
      setSearchUsername("");
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
      {err && <span className="error">{err}</span>}
      {/* Search Results */}
      {!!usersMatched?.length &&
        usersMatched.map((matchUser, matchIdx) => (
          <SearchedUser
            key={"userChat-" + matchIdx}
            click={() => handleSelect(matchIdx)}
            data={{ ...matchUser }}
          />
        ))}
    </div>
  );
};

export default Search;

function SearchedUser({ click, data }) {
  const { photoURL = fallbackImageURL, displayName = "undefined" } = data;
  return (
    <div className="userChat" onClick={click}>
      <img src={photoURL} alt="Searched User's Image" />
      <div className="userChatInfo">
        <span>{displayName}</span>
      </div>
    </div>
  );
}
