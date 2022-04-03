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
import MessageForm from "./MessageForm";
import ChatMessage from "./components/ChatMessage";
import ChatList from "./components/ChatList";

function App() {
  const [user, userLoading, userError] = useAuthState(auth);

  const [openMenu, setOpenMenu] = useState(false);

  const [roomSelection, setRoomSelection] = useState("PTY6qVozXSCkslCVg6ua");

  const messagesRef = collection(db, `/publicChats/${roomSelection}/messages`);
  const messagesQ = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages, messagesLoading, messagesError] = useCollectionData(
    messagesQ,
    {
      idField: "id",
    }
  );

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

  const dummy = useRef();

  useEffect(
    () => messages && dummy.current.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  return (
    <div className="main-container">
      <Header user={user} openMenu={openMenu} setOpenMenu={setOpenMenu}>
        {user && <UserDisplay user={user} />}
      </Header>
      <DropMenu
        user={user}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        setRoomSelection={setRoomSelection}
      />
      <main className="main-box">
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
