import "./index.css";
import { auth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import { useState } from "react";

function App() {
  const [user] = useAuthState(auth);
  const [openMenu, setOpenMenu] = useState(false);
  //console.log(user);
  return (
    <div className="main-container">
      <header className="header">
        <div className="flex justify-between">
          <h1 className="logo">
            <i className="ri-cloud-fill"></i>CloudChat
          </h1>
          <div className="flex justify-end gap-2">
            {user && (
              <p className="flex items-center gap-1 font-bold text-yellow-100 text-sm">
                <i className="ri-user-3-fill"></i> {user.displayName}
              </p>
            )}
            <i
              className={`ri-settings-4-fill text-3xl hover:cursor-pointer hover:text-yellow-50 
          ${openMenu ? "text-yellow-50" : "text-blue-500"} ${
                !user && "hidden"
              }`}
              onClick={() => setOpenMenu(!openMenu)}
            ></i>
          </div>
        </div>
        <nav className={`flex flex-col items-end select-none ${!openMenu && "hidden"}`}>
          <SignOut user={user} />
        </nav>
      </header>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
