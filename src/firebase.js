import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBb-pUewYFtzUvn4JMABG4U4h6Fw9n3fmw",
  authDomain: "serveeasy-3b112.firebaseapp.com",
  projectId: "serveeasy-3b112",
  storageBucket: "serveeasy-3b112.appspot.com",
  messagingSenderId: "386316575585",
  appId: "1:386316575585:web:f327fe15c4f49509a85b20",
  measurementId: "G-1KHK4FNM89",
};

// Изменения здесь
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Получаем уже инициализированное приложение, если оно есть
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, onAuthStateChanged, signOut };
