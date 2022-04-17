import defaultPic from "../images/cloud-fill.png";
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

export default function PrivateChats({
  user,
  accountSelection,
  setAccountSelection,
  setScreen,
}) {
  const privateChatsRef = collection(db, "accounts", user.uid, "privateChats");
  const privateChatsQ = query(
    privateChatsRef,
    orderBy("withUser"),
    limitToLast(25)
  );
  const [privateChats, privateChatsLoading, privateChatsError] =
    useCollectionData(privateChatsQ);

  console.log(privateChats);

  if (privateChatsLoading) {
    return <Loading />;
  } else if (privateChatsError) {
    return <Error error={privateChatsError} content={"private chats"} />;
  } else {
    return (
      <ul>
        {privateChats.map((chat, index) => {
          return <li key={index}>{chat.chatID}</li>;
        })}
      </ul>
    );
  }
}
