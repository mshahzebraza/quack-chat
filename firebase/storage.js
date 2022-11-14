import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// creating the firebaseStorage here will throw errors. reason not know
import { firebaseStorage } from "./index.js";

const whileInProcess = (snapshot) => {
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  switch (snapshot.state) {
    case "paused":
      console.log(`Upload paused @ ${progress || 0}% progress!`);
      break;
    case "running":
      console.log(`Upload started @ ${progress || 0}% progress!`);
      break;
  }
};

const onError = (error) => {
  // Handle unsuccessful uploads
  throw new Error("File Upload Error: ", error);
};

const onCompletion = (taskSnapShot, withDownloadPath) => async () => {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  const downloadURL = await getDownloadURL(taskSnapShot);
  withDownloadPath(downloadURL);
};

/**
 * @param  {string} userDefinedFilePath - the path where the image should be stored on firebase
 * @param  {function} withDownloadPath - callback with the downloadURL as the param
 */
export const uploadResumableData = async (
  file,
  userDefinedFilePath,
  withDownloadPath = (downloadURL) => {
    console.log("✅ File Uploaded Successfully! Download at: ", downloadURL);
  }
) => {
  const storageRef = ref(firebaseStorage, userDefinedFilePath);
  console.log("checkpoint");
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Register three observers:
  const downloadURLout = uploadTask.on(
    "state_changed", // 'running' | 'pause'
    // 1. 'state_changed' observer, called any time the state changes
    whileInProcess,
    // 2. Error observer, called on failure
    onError,
    // 3. Completion observer, called on successful completion
    onCompletion(uploadTask.snapshot.ref, withDownloadPath)
  );
};
