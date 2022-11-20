import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { doc, onSnapshot} from "firebase/firestore";

import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/UserChat.scss";
import { authUserAtom } from "../../firebase/auth";
import { firebaseFireStoreDB } from "../../firebase";
import { activeChatUserAtom } from "../../firebase/firestore";

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
        const activeChats = Object.entries(doc.data()).map(
          ([comboChatId, chatInfo]) => ({
            ...chatInfo,
            chatId: comboChatId,
          })
        );
        console.log(`Found active chats: `, activeChats);
        setChats(activeChats);
      }
    );

    return () => {
      console.log("Cleanup for Active Chats");
      return unsub();
    };
  }

  useEffect(() => {
    if (authUser?.uid) return getChats();
  }, []);

  /**
   * Selects one of the Active User Chats with the selectedUserInfo to update the "ChatWindow"
   * @param {Object} selectedUserInfo {photoURL,displayName,uid}
   */
  const handleSelect = (selectedUserInfo) => {
    // Change the Active Chat User
    console.log(
      "Selected Active Chat User: ",
      selectedUserInfo.displayName,
      selectedUserInfo
    );
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
            lastMessage={lastMessage?.text}
          />
        );
      })}
    </div>
  );
};

export default ActiveChats;

function UserChat({ userInfo = {}, click, lastMessageText = "Lorem ipsum" }) {
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