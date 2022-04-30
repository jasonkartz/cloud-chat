import { useCollectionData } from "react-firebase-hooks/firestore";
import Error from "../loading-error-display/Error";
import Loading from "../loading-error-display/Loading";
import { collection, orderBy, query, limitToLast } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../backend/firebase-config";
import PrivateChatUser from "./PrivateChatUser";

export default function PrivateChats({ user, setChatSelection, setOpenMenu }) {
  const [chatsLimit, setChatsLimit] = useState(20);

  const privateChatsRef = collection(db, "accounts", user.uid, "privateChats");
  const privateChatsQ = query(
    privateChatsRef,
    orderBy("withUser"),
    limitToLast(chatsLimit)
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
        {privateChats.length === chatsLimit && (
          <li>
            <button
              className="load-more-btn"
              onClick={() => setChatsLimit(chatsLimit + 20)}
            >
              Load more...
            </button>
          </li>
        )}
      </ul>
    );
  }
}
