import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Error from "./Error";
import Loading from "./Loading";
import {
  collection,
  orderBy,
  query,
  limitToLast,
  serverTimestamp,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function CreateChat({
  user,
  chatSelection,
  setChatSelection,
  setChatName,
}) {
  const [createChatName, setCreateChatName] = useState("");
  const [createChatStatus, setCreateChatStatus] = useState("");

  const accountRef = doc(db, "accounts", user.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  const publicChatsRef = collection(db, "publicChats");
  const publicChatsQ = query(publicChatsRef, orderBy("name"), limitToLast(25));
  const [publicChats, loading, error, snapshot] =
    useCollectionData(publicChatsQ);

  const createRoom = async () => {
    setCreateChatStatus("Creating room...");
    const newRoomRef = doc(collection(db, `publicChats`))
    await setDoc(newRoomRef, {
      createdAt: serverTimestamp(),
      creator: account.name,
      moderatorUID: user.uid,
      name: createChatName,
      id: newRoomRef.id
    }).then(() => {
      setCreateChatStatus("Opening room: " + createChatName);
      setChatSelection({
        id: newRoomRef.id,
        name: createChatName,
        path: "/publicChats/" + newRoomRef.id + "/messages",
      });
      setCreateChatStatus(createChatName + " is now live!");
      setCreateChatName("");
      setTimeout(() => setCreateChatStatus(""), 5000);
    });
  };

  return (
    <>
      <section className="border-b-2 border-blue-200 settings-section ">
        <h2 className="blue-heading">Create a chat</h2>

        <input
          type="text"
          placeholder="Enter room name / topic"
          className="form-input"
          value={createChatName}
          onChange={(e) => setCreateChatName(e.target.value)}
        />
        <button className="btn" onClick={createRoom} disabled={!createChatName}>
          Create Chat
        </button>
        <p>{createChatStatus}</p>
      </section>
    </>
  );
}
