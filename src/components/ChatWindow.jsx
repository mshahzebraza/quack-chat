import React from "react";

import Input from "./Input";
import Messages from "./Messages";

import "../styles/ChatWindow.scss";

const ChatWindow = () => {
  return (
    <div className="chatWindow">
      ChatWindow
      <Messages />
      <Input />
    </div>
  );
};

export default ChatWindow;
