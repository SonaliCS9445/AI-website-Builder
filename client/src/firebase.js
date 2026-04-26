// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genweb-ee73b.firebaseapp.com",
  projectId: "genweb-ee73b",
  storageBucket: "genweb-ee73b.firebasestorage.app",
  messagingSenderId: "935059675991",
  appId: "1:935059675991:web:d8ddfaa10c7e78c148bc12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth,provider};