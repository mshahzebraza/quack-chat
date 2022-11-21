import React, { useState } from "react";
import { useAtom } from "jotai";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

import ImgImageURL from "../assets/img.png";
import AttachImageURL from "../assets/attach.png";
import "../styles/Input.scss";
import { firebaseFireStoreDB, firebaseStorage } from "../../firebase/index.js";
import { authUserAtom } from "../../firebase/auth";
import { activeChatUserAtom } from "../../firebase/firestore";
import { createChatId } from "../lib/helpers";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [authUser] = useAtom(authUserAtom);
  const [activeChatUser] = useAtom(activeChatUserAtom);
  const chatId = createChatId(authUser.uid, activeChatUser.uid);

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      if (img) {
        const storageRef = ref(firebaseStorage, `messages/${chatId}/${uuid()}`); // creating a random name for the image

        // Upload the image
        const uploadTask = uploadBytesResumable(storageRef, img);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",

          whileInProgress(),
          onError(),
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("Image File uploaded at", downloadURL);

                // Upload the message in ChatGroup
                await updateDoc(doc(firebaseFireStoreDB, "chats", chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    uid: activeChatUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
                console.log("Updated the message with image");
              }
            );
          }
        );
      } else if (!img) {
        // Upload the message in ChatGroup without image
        await updateDoc(doc(firebaseFireStoreDB, "chats", chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            uid: activeChatUser.uid,
            date: Timestamp.now(),
          }),
        });
        console.log("Updated the message");
      }
      setImg(null);
      setText("");
    } catch (error) {
      console.error(error);
      throw new Error("Error Sending the message");
    }

    // update the last message of user chats for receiver (check for receiver)
    await updateDoc(doc(firebaseFireStoreDB, "userChats", activeChatUser.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });
    // update the last message of user chats for sender
    await updateDoc(doc(firebaseFireStoreDB, "userChats", authUser.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    console.log("Send Button Clicked", { text, img });
  };

  return (
    <form className="input" onSubmit={handleSend}>
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
        <button>Send</button>
      </div>
    </form>
  );
};

export default Input;

function onError(err) {
  console.error(err);
  throw new Error("Error uploading the image");
}

function whileInProgress() {
  return (snapshot) => {
    const { state, bytesTransferred, totalBytes } = snapshot;
    // Observe state change events such as progress, pause, and resume
    const progress = (bytesTransferred / totalBytes) * 100;
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    switch (state) {
      case "paused":
        console.log(`Upload paused @ ${progress || 0}% progress!`);
        break;
      case "running":
        console.log(`Upload running @ ${progress || 0}% progress!`);
        break;
    }
  };
}
