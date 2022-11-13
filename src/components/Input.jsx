import React, { useContext, useState } from "react";
import ImgImageURL from "../assets/img.png";
import AttachImageURL from "../assets/attach.png";
import "../styles/Input.scss";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);


  const handleSend = () => {
    console.log("Send Button Clicked");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={AttachImageURL} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={ImgImageURL} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
