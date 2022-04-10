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

export default function ChatList({
  user,
  roomSelection,
  setRoomSelection,
  setOpenMenu,
  setRoomName,
  roomName,
}) {
  const publicChatsRef = collection(db, "publicChats");
  const publicChatsQ = query(publicChatsRef, orderBy("name"), limitToLast(25));
  const [publicChats, loading, error, snapshot] =
    useCollectionData(publicChatsQ);


  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (error) {
    return (
      <>
        <Error />
      </>
    );
  } else {
    return (
      <>
        <ul>
          {publicChats.map((chatroom, index) => {
            const roomID =
            snapshot._snapshot.docChanges[index].doc.key.path.segments[6];
            return (
              <li
                className={`rounded px-1 ${
                  roomID === roomSelection
                    ? "bg-blue-50/25 text-gray-700"
                    : "hover:cursor-pointer hover:bg-blue-50/50 hover:text-blue-600"
                }`}
                key={index}
                onClick={() => {
                  if (roomID !== roomSelection) {
                    setRoomSelection(roomID);
                    setRoomName(chatroom.name);
                    setOpenMenu(false);
                  }
                }}
              >
                <span>
                  {chatroom.name}
                  {roomID === roomSelection && " (Current room)"}
                </span>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}
