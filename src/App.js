import "./index.css";
import { auth, db } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ChatRoom from "./components/ChatRoom";
import UserSettings from "./components/user-settings-page/UserSettings";
import SignIn from "./components/SignIn";
import DropMenu from "./components/DropMenu";
import { useState, useEffect } from "react";
import UserDisplay from "./components/UserDisplay";

function App() {
  const [user] = useAuthState(auth);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="main-container">
      <header className={`header`}>
        <div className="flex justify-between">
          <h1 className="logo">
            <i className="ri-cloud-fill"></i>CloudChat
          </h1>
          <div className="flex justify-end gap-2">
            {user && <UserDisplay user={user} />}
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
      <DropMenu user={user} setOpenMenu={setOpenMenu} openMenu={openMenu} />
      <main className="main-box">{user ? <ChatRoom /> : <SignIn />}</main>
    </div>
  );
}

export default App;
