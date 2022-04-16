import "./index.css";
import { auth, db } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  setDoc,
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
import UserProfile from "./components/UserProfile";
import UserList from "./components/UserList";

function App() {
  /* user auth state - displays signin if auth state is false*/
  const [user, userLoading, userError] = useAuthState(auth);

  /* account ID selection from UserList */
  const [accountSelection, setAccountSelection] = useState(null);

  /* drop-down menu toggled from header */
  const [openMenu, setOpenMenu] = useState(false);

  /* room selected from chat room list */
  const [chatSelection, setChatSelection] = useState({
    id: "96UnBx22d0OWd45HtlFt",
    name: "Main",
    path: "/publicChats/96UnBx22d0OWd45HtlFt/messages",
  });

  const messagesRef = collection(db, chatSelection.path);
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
    const newMessageRef = doc(messagesRef)
    await setDoc(newMessageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      messageID: newMessageRef.id,
    });

    setFormValue("");
  };

  /* scrolling chatroom to bottom */
  const dummy = useRef();

  useEffect(() => {
    if (user && messages) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [user, messages]);

  /* screen display in drop-down menu */

  const [screen, setScreen] = useState("chat");

  if (userLoading) {
    return <Loading />;
  } else if (userError) {
    return <Error />;
  } else {
    return (
      <div className="main-container">
        <Header
          user={user}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          chatSelection={chatSelection}
        >
          {user && (
            <UserDisplay
              user={user}
              setOpenMenu={setOpenMenu}
              setScreen={setScreen}
              setAccountSelection={setAccountSelection}
            />
          )}
        </Header>
        <DropMenu
          user={user}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          setChatSelection={setChatSelection}
          screen={screen}
          setScreen={setScreen}
          setAccountSelection={setAccountSelection}
          accountSelection={accountSelection}
        >
          {screen === "chat" && (
            <PublicChats
              user={user}
              chatSelection={chatSelection}
              setChatSelection={setChatSelection}
              setOpenMenu={setOpenMenu}
            />
          )}
          {screen === "create-chat" && (
            <CreateChat
              user={user}
              chatSelection={chatSelection}
              setChatSelection={setChatSelection}
              setOpenMenu={setOpenMenu}
            />
          )}
          {screen === "profile" && (
            <UserProfile
              user={user}
              accountSelection={accountSelection}
              setAccountSelection={setAccountSelection}
              setScreen={setScreen}
              setChatSelection={setChatSelection}
              setOpenMenu={setOpenMenu}
            />
          )}
          {screen === "users" && (
            <UserList
              user={user}
              accountSelection={accountSelection}
              setAccountSelection={setAccountSelection}
              setScreen={setScreen}
            />
          )}
          {screen === "settings" && <UserSettings user={user} />}
        </DropMenu>
        <main className="main-box">
          {userLoading ? (
            <Loading />
          ) : userError ? (
            <Error />
          ) : user ? (
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
}

export default App;

/* DIRECT CHATS
- use state to switch between 'public' or 'direct' 'Chats' in messagesRef collection path
- change 'chatSelection' to 'documentId' since this will also be used for direct messages
- direct chats will have a 'users' field containing an array of UIDs involved in the chat
- add 'message' to user profiles
- test with 2 user messages first using 'message' function, group chats can be done by 'create message'
- all chats are displayed under 'direct chats'. 'create message' can be added here
- add notifications when messages are recieved
*/
