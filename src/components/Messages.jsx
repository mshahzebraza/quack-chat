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
  const [messages, setMessages] = useState([]);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [activeChatUser, setActiveChatUser] = useAtom(activeChatUserAtom);
  console.log("messages: ", messages);

  const chatId = createChatId(activeChatUser?.uid, authUser?.uid);

  // Find the chats against the comboChatId (user1+user2)
  function fetchChats() {
    const unsub = onSnapshot(
      doc(firebaseFireStoreDB, "chats", chatId),
      (doc) => {
        if (doc.exists()) {
          console.log(`Found this doc: `, doc.data());
          setMessages(doc.data()?.messages);
        } else {
          console.log("No Chat Document exist");
        }
      }
    );

    return () => {
      console.log("Cleanup for Chat Messages");
      return unsub();
    };
  }

  // Run the fetchChats as soon as selectedUser Changes
  useEffect(() => {
    // running the fetchChats & returning the cleanup function at the same time
    return fetchChats();
  }, [activeChatUser.uid]);

  return (
    <div className="messages">
      {messages.map((m = {}, idx) => (
        <Message message={m} key={m?.id || idx} />
      ))}
    </div>
  );
};

export default Messages;
