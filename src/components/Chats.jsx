import React, { /* useContext, useEffect, */ useState } from "react";
import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/UserChat.scss";

const Chats = () => {
  const [chats, setChats] = useState(["a", "a", "a", "a"]);

  // const { currentUser } = useContext(AuthContext);

  const handleSelect = (u) => {
    console.log("Chats.jsx not working!");
    // dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(([chatIndex, chatContent]) => (
          <div
            className="userChat"
            key={chatIndex}
            onClick={() => handleSelect(chatIndex.userInfo)}
          >
            <img
              src={chatIndex?.userInfo?.photoURL || fallbackImageURL}
              alt="Contact's Image"
            />
            <div className="userChatInfo">
              <h4>{chatIndex?.userInfo?.displayName || "Dummy"}</h4>
              <p>{chatIndex?.lastMessage?.text || "Lorem Ipsum"}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
