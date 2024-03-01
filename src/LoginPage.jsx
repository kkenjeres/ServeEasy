import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import bg from "../src/assets/BG.svg";
import "./firebase";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Проверяем состояние аутентификации при монтировании компонента
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
      // В этом случае нам не нужно отписываться, так как переходим на другую страницу
    });
    return unsubscribe; // Отписываемся при размонтировании компонента
  }, [navigate, auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // setError(""); Необязательно здесь очищать ошибку, так как мы перенаправляем пользователя
    } catch (error) {
      setError("Failed to login: " + error.message);
      console.error("Login error: ", error.message);
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
          <div className="flex flex-col justify-start w-full">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b-2 border-black py-2 px-3"
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col justify-start w-full mt-4">
            <label htmlFor="password" className="mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-black py-2 px-3"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="mt-10 w-full px-4 py-2 rounded-full bg-black text-white"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
