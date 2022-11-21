import { useAtom } from "jotai";
import { activeChatUserAtom } from "../App";
import { authUserAtom } from "../App";
import "../styles/Message.scss";

const Message = ({ message }) => {
  const {
    img: imgPath,
    text = "No Content",
    uid: senderId,
    date = {},
  } = message;
  const { seconds: messageTime } = date;
  const [authUser] = useAtom(authUserAtom);
  const [activeChatUser] = useAtom(activeChatUserAtom);
  const senderImage = getSenderImage(senderId, authUser, activeChatUser);

  const isOwner = senderId === authUser.uid; // generates a random boolean
  console.log(" ");
  console.log("authUserId: ", authUser.uid);
  console.log("activeChatUserId: ", activeChatUser.uid);
  console.log("senderId: ", senderId);

  return (
    <div className={`message ${isOwner && "owner"}`}>
      <div className="messageInfo">
        <img src={senderImage} alt="Sender's Image" />
        <span>{getMessageTime(messageTime)}</span>
      </div>
      <div className="messageContent">
        <p>{text}</p>
        {imgPath && <img src={imgPath} alt="" />}
      </div>
    </div>
  );
};

export default Message;

function getSenderImage(senderId, authUser, activeChatUser) {
  const fallbackImage =
    "https://avatars.githubusercontent.com/u/65836206?s=40&v=4";
  if (senderId === authUser.uid) {
    return authUser.photoURL;
  } else if (senderId === activeChatUser.uid) {
    return activeChatUser.photoURL;
  } else return fallbackImage;
}

function getMessageTime(messageTime) {
  const sentTime = new Date(messageTime).toLocaleDateString();
  return sentTime;
}
