// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: VITE_Firebase_apiKey,
  authDomain: VITE_Firebase_authDomain,
  projectId: VITE_Firebase_projectId,
  storageBucket: VITE_Firebase_storageBucket,
  messagingSenderId: VITE_Firebase_messagingSenderId,
  appId: VITE_Firebase_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
