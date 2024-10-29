// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "heulib.firebaseapp.com",
  projectId: "heulib",
  storageBucket: "heulib.appspot.com",
  messagingSenderId: "386959784950",
  appId: "1:386959784950:web:ca32b10737168ca25fa5d7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);