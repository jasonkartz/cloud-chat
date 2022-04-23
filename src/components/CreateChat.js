import {
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Error from "./Error";
import Loading from "./Loading";
import {
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../backend/firebase-config";

export default function CreateChat({ user, setChatSelection }) {
  const [createChatName, setCreateChatName] = useState("");
  const [createChatStatus, setCreateChatStatus] = useState("");

  const accountRef = doc(db, "accounts", user.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  const createRoom = async () => {
    setCreateChatStatus("Creating room...");
    const newRoomRef = doc(collection(db, `publicChats`));
    await setDoc(newRoomRef, {
      createdAt: serverTimestamp(),
      creator: account.name,
      moderatorUID: user.uid,
      name: createChatName,
      id: newRoomRef.id,
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

  if (accountLoading) {
    return <Loading />;
  } else if (accountError) {
    return <Error error={accountError} content={"user data"} />;
  } else {
    return (
      <>
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
      </>
    );
  }
}
