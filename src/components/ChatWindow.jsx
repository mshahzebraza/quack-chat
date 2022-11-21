import React from "react";
import { useAtom } from "jotai";

import Input from "./Input";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import "../styles/ChatWindow.scss";
import "../styles/BlankChatWindow.scss";
import { activeChatUserAtom } from "../App";

const ChatWindow = () => {
  const [activeChatUser] = useAtom(activeChatUserAtom);
  return (
    <div className="chatWindow">
      {activeChatUser ? (
        <>
          <ChatHeader activeChatUserName={activeChatUser?.displayName} />
          <Messages />
          <Input />
        </>
      ) : (
        <BlankChat />
      )}
    </div>
  );
};

export default ChatWindow;

function BlankChat() {
  return (
    <div className="blankWindow">
      <h1>Choose a Chat to start conversation!</h1>
    </div>
  );
}
