import React from "react";
import { useAtom } from "jotai";

import CamImageURL from "../assets/cam.png";
import AddImageURL from "../assets/add.png";
import MoreImageURL from "../assets/more.png";
import "../styles/ChatHeader.scss";
import { activeChatUserAtom } from "../App";

const ChatHeader = ({ activeChatUserName = "No User" }) => {
  return (
    <div className="chatHeader">
      <span>{activeChatUserName}</span>
      <div className="chatIcons">
        <img src={CamImageURL} alt="Camera Image" />
        <img src={AddImageURL} alt="Add Image" />
        <img src={MoreImageURL} alt="More Image" />
      </div>
    </div>
  );
};

export default ChatHeader;
