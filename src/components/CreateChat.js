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
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomStatus, setCreateRoomStatus] = useState("");

  const accountRef = doc(db, "accounts", user.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  const publicChatsRef = collection(db, "publicChats");
  const publicChatsQ = query(publicChatsRef, orderBy("name"), limitToLast(25));
  const [publicChats, loading, error, snapshot] =
    useCollectionData(publicChatsQ);

  const createRoom = async () => {
    setCreateRoomStatus("Creating room...");
    await addDoc(collection(db, `publicChats`), {
      createdAt: serverTimestamp(),
      creator: account.name,
      moderatorUID: user.uid,
      name: createRoomName,
    }).then(() => {
      setCreateRoomStatus("Opening room: " + createRoomName);
      setChatSelection(createRoomName);
      setChatName(createRoomName);
      setCreateRoomStatus(createRoomName + " is now live!");
      setCreateRoomName("");
      setTimeout(() => setCreateRoomStatus(""), 5000);
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
          value={createRoomName}
          onChange={(e) => setCreateRoomName(e.target.value)}
        />
        <button className="btn" onClick={createRoom} disabled={!createRoomName}>
          Create Chat
        </button>
        <p>{createRoomStatus}</p>
      </section>
    </>
  );
}