import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "Use Your Own",
    authDomain: "Use Your Own",
    projectId: "Use Your Own",
    storageBucket: "Use Your Own",
    messagingSenderId: "Use Your Own",
    appId: "Use Your Own",
    measurementId: "Use Your Own"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
