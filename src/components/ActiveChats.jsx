import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { doc, onSnapshot } from "firebase/firestore";

import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/UserChat.scss";
import { authUserAtom } from "../App";
import { firebaseFireStoreDB } from "../../firebase";
import { activeChatUserAtom } from "../App";

const ActiveChats = () => {
  const [chats, setChats] = useState([]);
  const [authUser] = useAtom(authUserAtom);
  const [_, setActiveChatUser] = useAtom(activeChatUserAtom);

  /**
   * Lookout for any new groupChat against the current authenticated user and import the available chats in REALTIME
   * Add an eventHandle/Snapshot on the userChat.[authUser.uid] document and fetch all the nested documents
   * each nested documents represent a groupChat and contains the receiver's userInfo & date of chat creation
   */
  function getChats() {
    // Get Active Chats of the current user in Realtime
    const unsub = onSnapshot(
      doc(firebaseFireStoreDB, "userChats", authUser.uid),
      (doc) => {
        if (doc.exists()) {
          const ChatDocsList = Object.entries(doc.data());
          // Restructure the results from a Map to an Object
          const activeChats = ChatDocsList.map(([comboChatId, chatInfo]) => ({
            ...chatInfo,
            chatId: comboChatId,
          }));

          // Sort by date - descending (latest first)
          const activeChatsSorted = activeChats.sort((a, b) => {
            const fallbackA = a.date?.seconds;
            const fallbackB = b.date?.seconds || 0;
            return fallbackB - fallbackA; // a - b: asc, b -a: desc
          });
          setChats(activeChatsSorted);
        } else {
          console.error("No Active Chats Document Exists");
        }
      }
    );

    return () => {
      console.log("Cleanup for Active Chats");
      return unsub();
    };
  }

  useEffect(() => {
    if (authUser?.uid) return getChats();
  }, [authUser?.uid]);

  /**
   * Selects one of the Active User Chats with the selectedUserInfo to update the "ChatWindow"
   * @param {Object} selectedUserInfo {photoURL,displayName,uid}
   */
  const handleSelect = (selectedUserInfo) => {
    // Change the Active Chat User
    console.log("Selected Active Chat User: ", selectedUserInfo.displayName);
    setActiveChatUser(selectedUserInfo);
  };

  return (
    <div className="chats">
      {chats.map((chat) => {
        const { chatId, userInfo, date, lastMessage } = chat;
        return (
          <UserChat
            key={chatId}
            userInfo={userInfo}
            click={() => handleSelect(userInfo)}
            lastMessageText={lastMessage?.text}
          />
        );
      })}
    </div>
  );
};

export default ActiveChats;

function UserChat({ userInfo = {}, click, lastMessageText = "No Messages!" }) {
  const { photoURL = fallbackImageURL, displayName = "Dummy" } = userInfo;
  return (
    <div className="userChat" onClick={click}>
      <img src={photoURL} alt="Contact's Image" />
      <div className="userChatInfo">
        <h4>{displayName}</h4>
        <p>{lastMessageText}</p>
      </div>
    </div>
  );
}
