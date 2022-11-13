import React, { useState } from "react";
import Message from "./Message";
import "../styles/Messages.scss";

const Messages = () => {
  const [messages, setMessages] = useState(Array(50).fill({}));
  return (
    <div className="messages">
      {messages.map((m, idx) => (
        <Message message={m} key={m.id || idx} />
      ))}
    </div>
  );
};

export default Messages;
