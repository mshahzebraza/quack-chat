import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createChatId } from "../lib/helpers";
import Message from "./Message";
import "../styles/Messages.scss";
import { authUserAtom } from "../../firebase/auth";
import { activeChatUserAtom } from "../../firebase/firestore";
import { firebaseFireStoreDB } from "../../firebase";

const Messages = () => {
  const [messages, setMessages] = useState(Array(50).fill({}));
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [activeChatUser, setActiveChatUser] = useAtom(activeChatUserAtom);

  const chatId = createChatId(activeChatUser?.uid, authUser?.uid);

  // Find the chats against the comboChatId (user1+user2)
  function fetchChats() {
    const unsub = onSnapshot(
      doc(firebaseFireStoreDB, "chats", chatId),
      (doc) => {
        console.log(`Found these chats: `, doc.data());
      }
    );

    return () => {
      console.log("Cleanup for Chat Messages");
      return unsub();
    };
  }

  useEffect(() => {
    // running the fetchChats & returning the cleanup function at the same time
    return fetchChats();
  }, []);

  return (
    <div className="messages">
      {messages.map((m, idx) => (
        <Message message={m} key={m.id || idx} />
      ))}
    </div>
  );
};

export default Messages;
