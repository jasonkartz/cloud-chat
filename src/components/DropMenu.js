import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function DropMenu({
  user,
  setOpenMenu,
  openMenu,
  screen,
  setScreen,
  children,
}) {
  return (
    user && (
      <>
        <nav className={`select-none`}>
          <div
            className={`drop-menu flex justify-between visibility-transition ${
              openMenu ? "m-fadeIn" : "m-fadeOut"
            }`}
          >
            {/* children components here */}
            <div className="drop-menu-container">{children}</div>

            <ul className="drop-menu-selection">
              <li>
                <button
                  className={`${
                    screen === "settings" ? "menu-btn-selected" : "menu-btn "
                  }`}
                  disabled={screen === "settings"}
                  onClick={() => {
                    setScreen("settings");
                  }}
                >
                  <i className="ri-user-settings-line"></i>{" "}
                  <span>User Settings</span>
                </button>
              </li>
              <li>
                <button
                  className={`${
                    screen === "chat" ? "menu-btn-selected" : "menu-btn "
                  }`}
                  disabled={screen === "chat"}
                  onClick={() => {
                    setScreen("chat");
                  }}
                >
                  <i className="ri-search-line"></i> <span>Public Chats</span>
                </button>
              </li>
              <li>
                <button className="menu-btn" onClick={() => setOpenMenu(false)}>
                  <i className="ri-chat-private-line"></i>{" "}
                  <span>Direct Chat</span>
                </button>
              </li>
              <li>
                <button className="menu-btn" onClick={() => setOpenMenu(false)}>
                  <i className="ri-chat-new-line"></i> <span>Create Chat</span>
                </button>
              </li>
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    signOut(auth);
                    setOpenMenu(false);
                  }}
                >
                  <i className="align-bottom ri-logout-box-line"></i>{" "}
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </>
    )
  );
}
