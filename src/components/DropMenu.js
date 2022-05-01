import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function DropMenu({
  user,
  setOpenMenu,
  openMenu,
  screen,
  setScreen,
  accountSelection,
  setAccountSelection,
  children,
}) {
  return (
    user && (
      <>
        <nav className={`select-none`}>
          <div
            className={`drop-menu visibility-transition ${
              openMenu ? "m-fadeIn" : "m-fadeOut"
            }`}
          >
            {/* children components here */}
            <div className="drop-menu-container">{children}</div>

            <ul className="drop-menu-selection">
              {/* public chats */}
              <li>
                <button
                  className={`menu-btn ${
                    screen === "chat" ? "menu-btn-selected" : "menu-btn-normal"
                  }`}
                  disabled={screen === "chat"}
                  onClick={() => {
                    setScreen("chat");
                  }}
                >
                  <i className="ri-chat-3-line"></i> <span>Public Chats</span>
                </button>
              </li>

              {/* private chats */}
              <li>
              <button
                  className={`menu-btn ${
                    screen === "private-chats" ? "menu-btn-selected" : "menu-btn-normal"
                  }`}
                  disabled={screen === "private-chats"}
                  onClick={() => setScreen("private-chats")}
                >
                  <i className="ri-chat-private-line"></i> <span>Private Chats</span>
                </button>
              </li>

              {/* user search */}
              <li>
                <button
                  className={`menu-btn ${
                    screen === "users" ? "menu-btn-selected" : "menu-btn-normal"
                  }`}
                  disabled={screen === "users"}
                  onClick={() => {
                    setScreen("users");
                  }}
                >
                  <i className="ri-group-line"></i>{" "}
                  <span>Users</span>
                </button>
              </li>

              {/* profile */}
              <li>
                <button
                  className={`menu-btn ${
                    screen === "profile" && accountSelection === user.uid
                      ? "menu-btn-selected"
                      : "menu-btn-normal"
                  }`}
                  disabled={
                    screen === "profile" && accountSelection === user.uid
                  }
                  onClick={() => {
                    setScreen("profile");
                    setAccountSelection(user.uid);
                  }}
                >
                  <i className="ri-profile-line"></i> <span>Profile</span>
                </button>
              </li>

              {/* settings */}
              <li>
                <button
                  className={`menu-btn ${
                    screen === "settings" ? "menu-btn-selected" : "menu-btn-normal"
                  }`}
                  disabled={screen === "settings"}
                  onClick={() => {
                    setScreen("settings");
                  }}
                >
                  <i className="ri-settings-3-line"></i> <span>Settings</span>
                </button>
              </li>
              {/* sign out */}
              <li>
                <button
                  className="menu-btn menu-btn-normal"
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
