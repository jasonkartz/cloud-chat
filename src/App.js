import "./index.css";
import { auth, db } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  doc,
  query,
  orderBy,
  limitToLast,
  serverTimestamp,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Error from "./components/Error";
import Loading from "./components/Loading";
import SignIn from "./components/SignIn";
import DropMenu from "./components/DropMenu";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import UserDisplay from "./components/UserDisplay";
import MessageForm from "./components/MessageForm";
import ChatMessage from "./components/ChatMessage";
import PublicChats from "./components/PublicChats";
import UserSettings from "./components/user-settings-page/UserSettings";
import CreateChat from "./components/CreateChat";

function App() {
  /* user auth state - displays signin if auth state is false*/
  const [user, userLoading, userError] = useAuthState(auth);

  /* drop-down menu toggled from header */
  const [openMenu, setOpenMenu] = useState(false);

  /* room selected from chat room list */
  const [roomSelection, setRoomSelection] = useState("PTY6qVozXSCkslCVg6ua");
  const [roomName, setRoomName] = useState("main lobby");

  const messagesRef = collection(db, `/publicChats/${roomSelection}/messages`);
  const messagesQ = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages, messagesLoading, messagesError] = useCollectionData(
    messagesQ,
    {
      idField: "id",
    }
  );

  /* message form */
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
    });

    setFormValue("");
  };

  /* scrolling chatroom to bottom */
  const dummy = useRef();

  useEffect(
    () => {
      if (user && messages ) {
        dummy.current.scrollIntoView({ behavior: "smooth" })
      }
    },
    [user, messages]
  );

  /* screen display in drop-down menu */

  const [screen, setScreen] = useState("chat");

  return (
    <div className="main-container">
      <Header
        user={user}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        roomName={roomName}
      >
        {user && <UserDisplay user={user} />}
      </Header>
      <DropMenu
        user={user}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        setRoomSelection={setRoomSelection}
        screen={screen}
        setScreen={setScreen}
      >
        {screen === "chat" && (
          <PublicChats
          user={user}
            roomSelection={roomSelection}
            setRoomSelection={setRoomSelection}
            setOpenMenu={setOpenMenu}
            setRoomName={setRoomName}
            roomName={roomName}
          />
        )}
        {screen === "create-chat" && (
          <CreateChat
            user={user}
            roomSelection={roomSelection}
            setRoomSelection={setRoomSelection}
            setOpenMenu={setOpenMenu}
            setRoomName={setRoomName}
            roomName={roomName}
          />
        )}
        {screen === "settings" && <UserSettings user={user} />}
      </DropMenu>
      <main className="main-box">
        {userLoading && <Loading />}
        {userError && <Error />}
        {user ? (
          <>
            {messagesLoading && <Loading />}
            {messagesError && <Error />}
            {messages &&
              messages.map((message, index) => {
                return <ChatMessage key={index} message={message} />;
              })}

            <div className="mt-20" ref={dummy}></div>
          </>
        ) : (
          <SignIn />
        )}
      </main>
      {user && (
        <MessageForm
          sendMessage={sendMessage}
          formValue={formValue}
          setFormValue={setFormValue}
        />
      )}
    </div>
  );
}

export default App;
