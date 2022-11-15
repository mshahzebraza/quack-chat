import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// creating the firebaseStorage here will throw errors. reason not know
import { firebaseStorage } from "./index.js";

/**
 * Creates a storage-reference over the firebase-storage & its file-upload-path. Then uploads the file to the newly created storage-reference
 * @param  {string} filePayload - file to upload to firebase
 * @param  {string} uploadDestination - the path where the image should be stored on firebase
 * @param  {function} afterCompletion - callback that runs after upload completion with access to all "afterCompletionParams" + "downloadURL"
 * @param  {function} afterCompletionParams - collection of the params needed for the execution of afterCompletion
 */
export const uploadResumableData = async (
  filePayload,
  uploadDestination,
  afterCompletion = ({ downloadURL }) =>
    console.log("✅ File Uploaded Successfully! Download at: ", downloadURL),
  afterCompletionParams
) => {
  // creates a storage-reference - combine FB-storage & upload-destination
  const storageRef = ref(firebaseStorage, uploadDestination);
  // upload the file to storage-reference
  const uploadTask = uploadBytesResumable(storageRef, filePayload);

  // Monitor the upload by registering three observers:
  uploadTask.on(
    "state_changed", // 'running' | 'pause'
    // 1. 'state_changed' observer, called any time the state changes
    whileInProcess,
    // 2. Error observer, called on failure
    onError,
    // 3. Completion observer, called on successful completion
    onCompletion(
      uploadTask.snapshot.ref,
      afterCompletion,
      afterCompletionParams
    )
  );
};

/**
 * Observes state change events such as progress, pause, and resume regularly after every fixed duration using a "snapshot" object
 * @param  {Object} snapshot - contains useful methods i.e. state, bytesTransferred, totalBytes etc.
 */
function whileInProcess(snapshot) {
  // ? the snapshots are fetched after every N milliseconds
  const progress = Math.floor(
    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  );
  switch (snapshot.state) {
    case "paused":
      console.log(`Upload paused @ ${progress || 0}% progress!`);
      break;
    case "running":
      console.log(`Upload running @ ${progress || 0}% progress!`);
      break;
  }
}

/**
 * Handle unsuccessful uploads
 * @param  {} error
 */
function onError(error) {
  console.error("🔴 Error! ", error);
  // setError({state:true,code:error.code,message:error.message})
  throw new Error("File Upload Error: ", error);
}

/**
 * Handle successful uploads on complete.
 * the downloadable URL cannot be returned to the app. (or i don't know it)
 * Logic to handle the tasks after the completion could've been written here. However, giving the choice of callback to the user allows to use the downloadURL and initiate other tasks
 * For instance, get the download URL: https://firebasestorage.googleapis.com/...
 * @param  {} taskSnapShot - compulsory 'upload-snapshot' required to monitor the upload progress
 * @param  {function} afterCompletion - added feature: function to call on upload completion (custom function can be passed)
 * @param  {object} afterCompletionParams - collection of params to call the afterCompletion callback with
 */
function onCompletion(taskSnapShot, afterCompletion, afterCompletionParams) {
  return async function () {
    // Get the downloadable URL of the file
    const downloadURL = await getDownloadURL(taskSnapShot);
    console.log("✅ File Uploaded Successfully! Download at: ", downloadURL);

    // execute the afterCompletion callback and append downloadURL to its arguments
    afterCompletionParams.downloadURL = downloadURL;
    afterCompletion(afterCompletionParams);
  };
}
