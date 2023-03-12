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
import { authUserAtom } from "../App";
import { activeChatUserAtom } from "../App";
import { createChatId } from "../lib/helpers";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [authUser] = useAtom(authUserAtom);
  const [activeChatUser] = useAtom(activeChatUserAtom);
  const chatId = createChatId(authUser.uid, activeChatUser.uid);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const promises = [];

      if (img) {
        const storageRef = ref(firebaseStorage, `messages/${chatId}/${uuid()}`);
        // Upload the image
        const uploadTask = uploadBytesResumable(storageRef, img);

        // ? 1A. Create a new promise for uploading the image, and embed the upload path in a new chat message
        promises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              // Progress observer function
              whileInProgress,
              // Error observer function
              reject,
              // Completion observer function
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("✅ Image File uploaded at: ", downloadURL);

                try {
                  // Update the Firestore document with the new message object
                  await updateDoc(doc(firebaseFireStoreDB, "chats", chatId), {
                    messages: arrayUnion({
                      id: uuid(),
                      text,
                      uid: authUser.uid,
                      date: Timestamp.now(),
                      img: downloadURL,
                    }),
                  });

                  console.log("Updated the message with image");
                  resolve(); // Resolve the promise if the update is successful
                } catch (error) {
                  reject(error); // Reject the promise if there is an error during the update
                }
              }
            );
          })
        );
      } else if (!img) {
        promises.push(
          updateDoc(doc(firebaseFireStoreDB, "chats", chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              uid: authUser.uid,
              date: Timestamp.now(),
            }),
          })
        );
        console.log("Updated the message");
      }

      promises.push(
        // ? 1.B Create a regular chat message in the "userChat" collection 
        updateDoc(doc(firebaseFireStoreDB, "userChats", activeChatUser.uid), {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        }),

        updateDoc(doc(firebaseFireStoreDB, "userChats", authUser.uid), {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        })
      );

      // Execute all promises concurrently and wait for all of them to settle
      const results = await Promise.allSettled(promises);

      // Check the results of each promise
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          console.log("Promise fulfilled without values:", result.value);
        } else {
          console.error("Promise rejected with reason:", result.reason);
        }
      });
      setIsLoading(false)
      setText("")
      setImg(null)

    } catch (error) {
      console.error(error);
      throw new Error("Error Sending the message");
      setIsLoading(false)

    }
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
        {/* <img src={AttachImageURL} alt="" /> */}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={ImgImageURL} alt="" />
        </label>
        <button>{isLoading ? "Loading..." : "Send"}</button>
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
