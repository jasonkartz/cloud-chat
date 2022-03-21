import ChatMessage from "./ChatMessage";
import {
  collection,
  orderBy,
  query,
  limitToLast,
  serverTimestamp,
  addDoc,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db, auth } from "../backend/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef, useEffect } from "react";

export default function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const messagesQ = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages, loading, error] = useCollectionData(messagesQ, {
    idField: "id",
  });

  const [formValue, setFormValue] = useState("");

  const dummy = useRef();

  useEffect(
    () => dummy.current.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

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

  return (
    <>
      <main className="main-box">
        {loading && (
          <main className="main-box">
            <h2 className="flex gap-1 blue-heading">
              Loading
              <div className="animate-spin">
                <i className="ri-loader-5-line"></i>
              </div>
            </h2>
          </main>
        )}
        {error && (
          <main className="main-box">{`Error Loading Content :(`}</main>
        )}
        {messages &&
          messages.map((message, index) => {
            return <ChatMessage key={index} message={message} />;
          })}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          className="message-input"
          placeholder="Say something nice"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button type="submit" className="message-btn" disabled={!formValue}>
          <i className="ri-send-plane-fill"></i>
        </button>
      </form>
    </>
  );
}
