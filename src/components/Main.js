import { auth, db } from "../backend/firebase-config";
import {
  collection,
  setDoc,
  doc,
  query,
  orderBy,
  limitToLast,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Error from "./Error";
import Loading from "./Loading";
import DropMenu from "./DropMenu";
import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import UserDisplay from "./UserDisplay";
import MessageForm from "./MessageForm";
import ChatMessage from "./ChatMessage";
import PublicChats from "./PublicChats";
import UserSettings from "./user-settings-page/UserSettings";
import CreateChat from "./CreateChat";
import UserProfile from "./UserProfile";
import UserList from "./UserList";
import PrivateChats from "./PrivateChats";

function Main({
  user,
  userLoading,
  userError,
  cloudImg,
  darkMode,
  setDarkMode,
  systemTheme,
setSystemTheme,
}) {
  const accountRef = doc(db, "accounts", auth.currentUser.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  useEffect(() => {
    async function accountSync() {
      const { uid, displayName, email, photoURL } = auth.currentUser;
      if (account) {
        setDoc(accountRef, {
          uid: uid,
          name: displayName,
          userName: account?.userName || "",
          email: email,
          photoURL: photoURL || cloudImg,
          lastLogin: serverTimestamp(),
          followers: account.followers || [],
          following: account.following || [],
        });
      }
    }
    accountSync();
  }, []);

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

  /* for viewing older messages, sets limitToLast in messagesQ below*/

  const [messagesLimit, setMessagesLimit] = useState(25);

  /* resets message limit when changing chats */

  useEffect(() => {
    setMessagesLimit(25);
  }, [chatSelection]);

  const messagesRef = collection(db, chatSelection.path);
  const messagesQ = query(
    messagesRef,
    orderBy("createdAt"),
    limitToLast(messagesLimit)
  );
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
    const newMessageRef = doc(messagesRef);
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
    return <Error error={userError} content={"user"} />;
  } else {
    return (
      <div className={`${darkMode && "dark"}`}>
        <div className="background">
          <div className={`main-container`}>
            <Header
              user={user}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              chatSelection={chatSelection}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              systemTheme={systemTheme}
            >
              {user && (
                <UserDisplay
                  user={user}
                  setOpenMenu={setOpenMenu}
                  setScreen={setScreen}
                  setAccountSelection={setAccountSelection}
                  account={account}
                  accountLoading={accountLoading}
                  accountError={accountError}
                  cloudImg={cloudImg}
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
                  chatSelection={chatSelection}
                  setChatSelection={setChatSelection}
                  setOpenMenu={setOpenMenu}
                >
                  <CreateChat
                    user={user}
                    setChatSelection={setChatSelection}
                    setOpenMenu={setOpenMenu}
                    account={account}
                    accountLoading={accountLoading}
                    accountError={accountError}
                  />
                </PublicChats>
              )}
              {screen === "private-chats" && (
                <PrivateChats
                  user={user}
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
                  account={account}
                  accountLoading={accountLoading}
                  accountError={accountError}
                  accountRef={accountRef}
                />
              )}
              {screen === "users" && (
                <UserList
                  user={user}
                  setAccountSelection={setAccountSelection}
                  setScreen={setScreen}
                />
              )}
              {screen === "settings" && (
                <UserSettings
                  user={user}
                  accountRef={accountRef}
                  account={account}
                  accountLoading={accountLoading}
                  accountError={accountError}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  systemTheme={systemTheme}
                  setSystemTheme={setSystemTheme}
                />
              )}
            </DropMenu>
            <main className="main-box">
              <>
                {messagesLoading && <Loading />}
                {messagesError && (
                  <Error
                    error={messagesError}
                    content={"messages. Try refreshing your browser."}
                  />
                )}
                {messages && (
                  <>
                    {messages.length === messagesLimit && (
                      <button
                        className="load-more-btn"
                        onClick={() => setMessagesLimit(messagesLimit + 25)}
                      >
                        Load older messages
                      </button>
                    )}
                    {messages.map((message, index) => {
                      return (
                        <ChatMessage
                          key={index}
                          message={message}
                          setOpenMenu={setOpenMenu}
                          setAccountSelection={setAccountSelection}
                          setScreen={setScreen}
                          account={account}
                          accountLoading={accountLoading}
                          accountError={accountError}
                        />
                      );
                    })}
                  </>
                )}

                <div className="mt-16" ref={dummy}></div>
              </>
            </main>
            {user && (
              <MessageForm
                sendMessage={sendMessage}
                formValue={formValue}
                setFormValue={setFormValue}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;