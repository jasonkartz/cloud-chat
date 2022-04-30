import {
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Error from "../loading-error-display/Error";
import Loading from "../loading-error-display/Loading";
import {
  collection,
  orderBy,
  query,
  limitToLast,
} from "firebase/firestore";
import { db } from "../../backend/firebase-config";

export default function PublicChats({
  chatSelection,
  setChatSelection,
  setOpenMenu,
  children
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
        <section className="settings-section" >{children}</section>
        <h1 className="mb-1 border-b-2 heading border-blue-50">Chats</h1>
        <ul>
          {publicChats.map((chatroom, index) => {
            const chatID = chatroom.id;
            return (
              <li
                className={`rounded px-1 ${
                  chatID === chatSelection
                    ? "bg-blue-50/25 text-gray-700"
                    : "chat-list-display"
                }`}
                key={index}
                onClick={() => {
                  if (chatID !== chatSelection.id) {
                    setChatSelection({
                      id: chatID,
                      name: chatroom.name,
                      path: "/publicChats/" + chatID + "/messages",
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
