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
  documentId,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function ChatList({
  user,
  chatSelection,
  setChatSelection,
  setOpenMenu,
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
            const chatID = chatroom.id
            return (
              <li
                className={`rounded px-1 ${
                  chatID === chatSelection
                    ? "bg-blue-50/25 text-gray-700"
                    : "hover:cursor-pointer hover:bg-blue-50/50 hover:text-blue-600"
                }`}
                key={index}
                onClick={() => {
                  if (chatID !== chatSelection.id) {
                    setChatSelection({
                      id: chatID,
                      name: chatroom.name,
                      path: "/publicChats/" + chatID +"/messages"
                    });
                    setOpenMenu(false);
                  }
                }}
              >
                <span>
                  {chatroom.name}
                  {chatID === chatSelection.id && " (Current room)"}
                </span>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}


// snapshot._snapshot.docChanges[index].doc.key.path.segments[6]