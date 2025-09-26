// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjqBphIDL44onQTdci5VnU9-aggg4KC3o",
  authDomain: "volitancrooss-page.firebaseapp.com",
  projectId: "volitancrooss-page",
  storageBucket: "volitancrooss-page.firebasestorage.app",
  messagingSenderId: "1093972738497",
  appId: "1:1093972738497:web:6ff63d087deeabe9842f40",
  measurementId: "G-Y5TYCFTYQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);