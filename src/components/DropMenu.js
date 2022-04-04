import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function DropMenu({
  user,
  setOpenMenu,
  openMenu,
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

            <ul className="text-right ">
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setScreen("settings");
                  }}
                >
                  <i className="ri-user-settings-line"></i> User Settings
                </button>
              </li>
              <li>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setScreen("chat");
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

