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
      <header className={`header`}>
        <div className="flex justify-between">
          <h1 className="logo">
            <i className="ri-cloud-fill"></i>CloudChat
          </h1>
          <div className="flex justify-end gap-2">
            {user && (
              <p className="flex items-center gap-1 text-sm font-bold text-yellow-100 select-none">
                <i className="text-green-300 ri-user-3-fill"></i> {user.displayName}
              </p>
            )}
            <i
              className={`ri-settings-4-fill text-3xl hover:cursor-pointer hover:text-yellow-50 
          ${openMenu ? "text-yellow-100" : "text-blue-600"} ${
                !user && "hidden"
              }`}
              onClick={() => setOpenMenu(!openMenu)}
            ></i>
          </div>
        </div>
      </header>
      <nav
        className={`flex flex-col items-end select-none`}
      >
        <ul className={`fixed w-full p-2 text-right bg-blue-400/90 drop-shadow-b border-t-blue-50/50 border-t-2 ${
          !openMenu && "hidden"
        }`}>
          <li>
            <button className="settings-btn"><i className="ri-user-settings-line"></i> User Settings</button>
          </li>
          <li>
            <button className="settings-btn"><i className="ri-search-line"></i> Public Chats</button>
          </li>
          <li>
            <button className="settings-btn"><i className="ri-chat-private-line"></i> Direct Chat</button>
          </li>
          <li>
          <button className="settings-btn"><i className="ri-chat-new-line"></i> Create Chat</button>
          </li>
          <li>
            <SignOut user={user} />
          </li>
        </ul>
      </nav>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
