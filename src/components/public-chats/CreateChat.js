import Error from "../loading-error-display/Error";
import Loading from "../loading-error-display/Loading";
import { collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../backend/firebase-config";

export default function CreateChat({
  user,
  setChatSelection,
  account,
  accountLoading,
  accountError,
}) {
  const [createChatName, setCreateChatName] = useState("");
  const [createChatStatus, setCreateChatStatus] = useState("");

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
        <h2 className="heading">Create a chat</h2>
        <div class="flex gap-2 w-full">
          <input
            type="text"
            placeholder="name / topic"
            className="text-input"
            value={createChatName}
            onChange={(e) => setCreateChatName(e.target.value)}
          />
          <button
            className="font-light btn"
            onClick={createRoom}
            disabled={!createChatName}
          >
            <i className="text-2xl ri-add-box-line"></i>
          </button>
        </div>
        <p>{createChatStatus}</p>
      </>
    );
  }
}
