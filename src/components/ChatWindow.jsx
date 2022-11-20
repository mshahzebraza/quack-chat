import React from "react";
import { useAtom } from "jotai";

import Input from "./Input";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import "../styles/ChatWindow.scss";
import { activeChatUserAtom } from "../../firebase/firestore";

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
  return <div>"Select a User"</div>;
}
