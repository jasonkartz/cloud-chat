import "./index.css";
import { auth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import UserSettings from "./components/UserSettings";
import SignIn from "./components/SignIn";
import MainMenu from "./components/MainMenu";
import { useState } from "react";

function App() {
  const [user] = useAuthState(auth);
  const [openMenu, setOpenMenu] = useState(false);
  console.log(user);
  const screenMap = {
    chat: <ChatRoom />,
    settings: <UserSettings user={user} />,
  };
  const [screen, setScreen] = useState(screenMap.chat);

  return (
    <div className="main-container">
      <header className={`header`}>
        <div className="flex justify-between">
          <h1 className="logo">
            <i className="ri-cloud-fill"></i>CloudChat
          </h1>
          <div className="flex justify-end gap-2">
            {user && (
              <p className="flex items-center gap-1 text-sm font-bold select-none text-blue-50">
                <i className="text-green-300 ri-user-3-fill animate-pulse"></i>{" "}
                {user.displayName}
              </p>
            )}
            <i
              className={`text-blue-100 transition text-3xl hover:cursor-pointer hover:text-yellow-100 
          ${openMenu ? "ri-close-line" : "ri-menu-5-line"} ${
                !user && "hidden"
              }`}
              onClick={() => setOpenMenu(!openMenu)}
            ></i>
          </div>
        </div>
      </header>
      <MainMenu
        user={user}
        setOpenMenu={setOpenMenu}
        setScreen={setScreen}
        openMenu={openMenu}
        screenMap={screenMap}
      />
      {user ? screen : <SignIn />}
    </div>
  );
}

export default App;
