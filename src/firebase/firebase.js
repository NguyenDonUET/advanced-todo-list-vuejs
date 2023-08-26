import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; //realtime

const firebaseConfig = {
    apiKey: "AIzaSyBhVtUQLqNqlsp924BH5UGcQHVxmBwWcOI",
    authDomain: "advanced-todo-list-12295.firebaseapp.com",
    projectId: "advanced-todo-list-12295",
    storageBucket: "advanced-todo-list-12295.appspot.com",
    messagingSenderId: "128761592087",
    appId: "1:128761592087:web:0ef4ca5d80ca8487329f52",
    measurementId: "G-NXDP01WLRM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const auth = getAuth();
