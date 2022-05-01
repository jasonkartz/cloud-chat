import { auth, db } from "../backend/firebase-config";
import Filter from "bad-words";
import {
  collection,
  setDoc,
  doc,
  query,
  orderBy,
  limitToLast,
  serverTimestamp,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Error from "./loading-error-display/Error";
import Loading from "./loading-error-display/Loading";
import DropMenu from "./DropMenu";
import { useState, useEffect, useRef } from "react";
import Header from "./header/Header";
import UserDisplay from "./header/UserDisplay";
import MessageForm from "./messaging/MessageForm";
import ChatMessage from "./messaging/ChatMessage";
import PublicChats from "./public-chats/PublicChats";
import UserSettings from "./user-settings-page/UserSettings";
import CreateChat from "./public-chats/CreateChat";
import UserProfile from "./users/UserProfile";
import UserList from "./users/UserList";
import PrivateChats from "./private-chats/PrivateChats";

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
  /* account reference from firebase firestore */
  const accountRef = doc(db, "accounts", auth.currentUser.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

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

  /* bad-words filter */
  const swearFilter = new Filter();

  /* message form */
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
      text: swearFilter.clean(formValue),
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
                setDarkMode={setDarkMode}
                systemTheme={systemTheme}
                setSystemTheme={setSystemTheme}
              />
            )}
          </DropMenu>
          <main className="chat-box" onClick={() => setOpenMenu(false)}>
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

              <div className="mt-20" ref={dummy}></div>
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
    );
  }
}

export default Main;
