import ChatMessage from "./ChatMessage";
import {
  collection,
  orderBy,
  query,
  limitToLast,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../backend/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef, useEffect } from "react";

export default function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages] = useCollectionData(q, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const dummy = useRef();

  useEffect(
    () => dummy.current.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });

    setFormValue("");
  };

  return (
    <>
      <main className="main-box">
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
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
