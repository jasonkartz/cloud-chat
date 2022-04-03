import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";
import { useState } from "react";
import ChatList from "./ChatList";
import UserSettings from "./user-settings-page/UserSettings";

export default function DropMenu({ user, setOpenMenu, openMenu}) {
  const screenMap = {
    chat: <ChatList />,
    settings: <UserSettings user={user} />,
  };

  const [screen, setScreen] = useState(screenMap.chat);

  return (
    user && (
      <>
        <nav className={`select-none`}>
          <div
            className={`drop-menu flex justify-between visibility-transition ${
              openMenu ? "m-fadeIn" : "m-fadeOut"
            }`}
          >
            {screen}
            <ul className="text-right ">
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setScreen(screenMap.settings);
                    
                  }}
                >
                  <i className="ri-user-settings-line"></i> User Settings
                </button>
              </li>
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setScreen(screenMap.chat);
                    
                  }}
                >
                  <i className="ri-search-line"></i> Public Chats
                </button>
              </li>
              <li>
                <button className="menu-btn" onClick={() => setOpenMenu(false)}>
                  <i className="ri-chat-private-line"></i> Direct Chat
                </button>
              </li>
              <li>
                <button className="menu-btn" onClick={() => setOpenMenu(false)}>
                  <i className="ri-chat-new-line"></i> Create Chat
                </button>
              </li>
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    signOut(auth);
                    setOpenMenu(false);
                    setScreen(screenMap.chat);
                  }}
                >
                  <i className="align-bottom ri-logout-box-line"></i> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </>
    )
  );
}

/*flex flex-col items-end */
