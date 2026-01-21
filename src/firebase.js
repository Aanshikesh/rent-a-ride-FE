

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "import.meta.env.VITE_FIREBASE_API_KEY",
  authDomain: "rent-a-ride-3b435.firebaseapp.com",
  projectId: "rent-a-ride-3b435",
  storageBucket: "rent-a-ride-3b435.firebasestorage.app",
  messagingSenderId: "693944698196",
  appId: "1:693944698196:web:cd3423b1c1bc7fcf62f4c1",
  measurementId: "G-LXN8DG7N6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);