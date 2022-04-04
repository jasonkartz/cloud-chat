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
  doc
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function ChatList({setRoomSelection, setOpenMenu}) {
  const publicChatsRef = collection(db, "publicChats");
  const publicChatsQ = query(publicChatsRef, orderBy("name"), limitToLast(25));
  const [publicChats, loading, error, snapshot] = useCollectionData(publicChatsQ);

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
      <ul>
        {publicChats.map((chatroom, index) => (
          <li
            className="px-1 pb-1 rounded hover:cursor-pointer hover:bg-blue-50/50"
            key={index}
            onClick={() => {
              setRoomSelection(snapshot._snapshot.docChanges[index].doc.key.path.segments[6])
              setOpenMenu(false)
            }}
          >

            <span>{chatroom.name}</span>
          </li>
        ))}
      </ul>
    );
  }
}
