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

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <main className="flex flex-col gap-3 px-3 py-2 overflow-y-scroll bg-blue-300 grow">
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        <div ref={dummy}></div>
      </main>
      <form
        onSubmit={sendMessage}
        className="flex items-center justify-between gap-2 p-2 bg-blue-100 bg-opacity-25 rounded-b md:text-lg"
      >
        <input
          className="h-12 p-1 rounded shadow-inner text-slate-800 grow bg-blue-50"
          placeholder="Say something nice"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button
          type="submit"
          className="w-12 h-12 font-bold text-blue-100 bg-blue-500 rounded 
          disabled:opacity-50 drop-shadow hover:text-yellow-100 active:drop-shadow-sm"
          disabled={!formValue}
        >
          <i className="ri-send-plane-fill"></i>
        </button>
      </form>
    </>
  );
}
