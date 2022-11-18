import React from "react";

import Input from "./Input";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import "../styles/ChatWindow.scss";

const ChatWindow = () => {
  return (
    <div className="chatWindow">
      <ChatHeader userName={"Unauthorized"} />
      <Messages />
      <Input />
    </div>
  );
};

export default ChatWindow;
