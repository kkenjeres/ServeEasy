import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import bg from '../src/assets/BG.svg'
import {BsPersonCircle, BsPersonFill} from 'react-icons/bs'

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

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export { app, auth, db, loginUser};



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginUser(email, password);
      if (user) {
        localStorage.setItem('userId', user.uid);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFaceIdLogin = async (event) => {
    event.preventDefault();
    const options = {
      challenge: new Uint8Array(32),
      allowCredentials: [
        {
          type: "public-key",
          id: new Uint8Array(16),
          transports: ["internal"],
        },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
      },
      userVerification: "required",
    };

    try {
      const credential = await navigator.credentials.get({
        publicKey: options,
      });
      // Use the credential to authenticate the user
      console.log("Credential:", credential);
      localStorage.setItem('userId', 'faceIdUser');
      navigate.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId === 'faceIdUser') {
      handleFaceIdLogin({ preventDefault: () => {} });
    } else if (userId) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="bg-white p-2 rounded-lg w-[90%] text-center py-10">
        <span className="text-center flex justify-center">
          <BsPersonCircle className="w-[100px] h-[100px] fill" />
        </span>
        <form onSubmit={handleLogin} className="mt-10 w-[80%] m-auto">
          <div className="flex-col flex justify-start w-full">
            <label className="flex mb-2" htmlFor="name">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-black rounded-none py-2 "
              placeholder="Geben Sie Ihre E-Mail ein"
            />
          </div>
          <div className="flex-col flex justify-start w-full mt-4">
            <label className="flex mb-2" htmlFor="name">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-black rounded-none py-2 "
              placeholder="Geben Sie Ihr Passwort ein"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-black mt-10 text-white w-full"
          >
            Login
          </button>
        </form>
        {/* Add button for Face ID login */}
        {window.FaceDetector && (
          <button
            onClick={handleFaceIdLogin}
            className="px-4 py-2 rounded-full bg-blue-500 text-white mt-5 w-full"
          >
            Login with Face ID
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
