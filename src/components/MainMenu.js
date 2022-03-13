import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function MainMenu({
  user,
  setOpenMenu,
  openMenu,
  setScreen,
  screenMap,
}) {
  return (
    user && (
      <>
        <nav className={`flex flex-col items-end select-none`}>
          <ul
            className={`drop-menu .visibility-transition ${
              openMenu ? "m-fadeIn" : "m-fadeOut"
            }`}
          >
            <li>
              <button
                className="menu-btn"
                onClick={() => {
                  setScreen(screenMap.settings);
                  setOpenMenu(false);
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
                  setOpenMenu(false);
                }}
              >
                <i className="ri-search-line"></i> Public Chats
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => setOpenMenu(false)}
              >
                <i className="ri-chat-private-line"></i> Direct Chat
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => setOpenMenu(false)}
              >
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
        </nav>
      </>
    )
  );
}
