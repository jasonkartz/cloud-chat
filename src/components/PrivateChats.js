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
  getDoc,
  serverTimestamp,
  addDoc,
  doc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";
import PrivateChatUser from "./PrivateChatUser";

export default function PrivateChats({ user, setChatSelection, setOpenMenu }) {
  const privateChatsRef = collection(db, "accounts", user.uid, "privateChats");
  const privateChatsQ = query(
    privateChatsRef,
    orderBy("withUser"),
    limitToLast(25)
  );
  const [privateChats, privateChatsLoading, privateChatsError] =
    useCollectionData(privateChatsQ);

  if (privateChatsLoading) {
    return <Loading />;
  } else if (privateChatsError) {
    return <Error error={privateChatsError} content={"private chats"} />;
  } else {
    return (
      <ul>
        {privateChats.map((chat, index) => {
          return (
            <PrivateChatUser
              key={index}
              chat={chat}
              setChatSelection={setChatSelection}
              setOpenMenu={setOpenMenu}
            />
          );
        })}
      </ul>
    );
  }
}


