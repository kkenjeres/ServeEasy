import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtFNeA9fKxOxBGvnsn4wZMrkeDaFr5d9o",
  authDomain: "branko-1a7dd.firebaseapp.com",
  projectId: "branko-1a7dd",
  storageBucket: "branko-1a7dd.appspot.com",
  messagingSenderId: "720327257363",
  appId: "1:720327257363:web:4d87e40c3028b752d3fee6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, onAuthStateChanged, signOut };
