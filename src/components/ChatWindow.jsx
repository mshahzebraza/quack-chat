import React from "react";
import { useAtom } from "jotai";

import Input from "./Input";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import "../styles/ChatWindow.scss";
import "../styles/BlankChatWindow.scss";
import { activeChatUserAtom } from "../App";
import { authUserAtom } from "../App";

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
  const [authUser] = useAtom(authUserAtom);

  return (
    <div className="blankWindow">
      {/* import CamImageURL from "../assets/cam.png"; */}

      <img style={{ marginBottom: "1rem" }} src="/svgLogo.svg" alt="svg logo" />
      <h1>Welcome, {authUser.displayName} 👋</h1>
      <h2>Choose a Chat to start conversation!</h2>
    </div>
  );
}
