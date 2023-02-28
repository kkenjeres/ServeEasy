import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {

  apiKey: "AIzaSyACtbBgoL3zMSan0hLsenIUBJJRdKEuy74",

  authDomain: "rest-9be9d.firebaseapp.com",

  projectId: "rest-9be9d",

  storageBucket: "rest-9be9d.appspot.com",

  messagingSenderId: "1071388118345",

  appId: "1:1071388118345:web:52373773bf237cb6e91e98"

};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };