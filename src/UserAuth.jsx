import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, signOut } from "../src/firebase";
import { FiLogOut } from "react-icons/fi";

const UserAuth = () => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <hedaer className="py-4 flex justify-between px-2 items-center bg-gray-100">
      <div className="flex flex-col">
        <span>Hallo 👋</span>
        <span>{userEmail ? ` ${userEmail}` : "Not logged in"}</span>
      </div>

      {userEmail && (
        <button
          onClick={handleSignOut}
          className=" text-black rounded text-[26px]"
        >
          <FiLogOut />
        </button>
      )}
    </hedaer>
  );
};

export default UserAuth;
