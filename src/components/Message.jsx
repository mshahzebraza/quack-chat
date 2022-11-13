import "../styles/Message.scss";

const Message = ({ message }) => {
  const isOwner = Math.floor(Math.random() * 10) % 2 === 0; // generates a random boolean
  //   const { currentUser } = useContext(AuthContext);

  return (
    <div className={`message ${isOwner && "owner"}`}>
      <div className="messageInfo">
        <img
          src={"https://avatars.githubusercontent.com/u/65836206?s=40&v=4"}
          alt="Sender's Image"
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message?.text || "No Content"}</p>
        {message?.img && <img src={message?.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
