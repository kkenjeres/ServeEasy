import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import bg from "../src/assets/BG.svg";
import { BsPersonCircle, BsPersonFill } from "react-icons/bs";

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    localStorage.setItem("user", user.uid); // store user ID in local storage
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginUser(email, password);
      if (user) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="bg-white p-2 rounded-lg w-[90%] text-center py-10">
        <h1 className="font-bold text-[40px]">Login</h1>
        <form onSubmit={handleLogin} className="mt-10 w-[80%] m-auto">
          <div className="flex-col flex justify-start w-full">
            <label className="flex mb-2" htmlFor="name">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-none border-b-2 border-black rounded-none py-2 px-3"
              placeholder="Email"
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
              className="border-none border-b-2 border-black rounded-none py-2 px-3"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-black mt-10 text-white w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
