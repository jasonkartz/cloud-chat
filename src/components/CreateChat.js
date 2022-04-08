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
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function CreateChat({
  user,
  roomSelection,
  setRoomSelection,
  setRoomName,
}) {
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomStatus, setCreateRoomStatus] = useState("");

  const [selectedRoomToDelete, setSelectedRoomToDelete] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

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
      setRoomSelection(createRoomName);
      setRoomName(createRoomName);
      setCreateRoomStatus(createRoomName + " is now live!");
      setCreateRoomName("");
      setTimeout(() => setCreateRoomStatus(""), 5000);
    });
  };

  const deleteRoom = async () => {};

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

      <section className="settings-section">
        <h2 className="blue-heading">Delete a chat</h2>
        {selectedRoomToDelete && (
          <>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              className="form-input"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
            />
            <button
              className="btn"
              onClick={deleteRoom}
              disabled={!confirmDelete}
            >
              Delete
            </button>
          </>
        )}
        {publicChats && (
          <ul>
            {publicChats.map((chatroom, index) => {
              if (chatroom.moderatorUID === user.uid) {
                const roomID =
                  snapshot._snapshot.docChanges[index].doc.key.path.segments[6];
                return (
                  <li
                    className={`rounded px-1 hover:cursor-pointer ${
                      roomID === selectedRoomToDelete
                        ? "bg-blue-50/25 text-gray-700"
                        : "hover:bg-blue-50/50 hover:text-blue-600"
                    }`}
                    key={index}
                    onClick={() => {
                      setSelectedRoomToDelete(selectedRoomToDelete === roomID ? "" : roomID);
                      console.log(roomID);
                    }}
                  >
                    <span>
                      {chatroom.name}
                      {roomID === selectedRoomToDelete && " - (Selected)"}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
        )}
      </section>
    </>
  );
}
