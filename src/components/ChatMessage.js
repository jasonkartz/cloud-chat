import defaultPic from "../images/cloud-fill.png";
import { auth, db } from "../backend/firebase-config";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import Loading from "./Loading";
import Error from "./Error";

export default function ChatMessage({
  message,
  setOpenMenu,
  setAccountSelection,
  setScreen,
}) {
  const { text, uid, createdAt } = message;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);
  const [displayTimeStamp, setDisplayTimeStamp] = useState(false);

  const photoStatus = () => {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <img
          src={account.photoURL || defaultPic}
          alt="user"
          width="45"
          className={`rounded hover:cursor-pointer hover:outline hover:outline-yellow-200`}
          onClick={() => {
            setAccountSelection(uid);
            setScreen("profile");
            setOpenMenu(true);
          }}
        />
      );
    }
  };

  const nameStatus = () => {
    if (loading) {
      return <Loading />;
    } else if (account) {
      return account.userName || account.name;
    } else {
      return (
        <>
          <i className="ri-close-circle-line"></i> Deleted User
        </>
      );
    }
  };

  const messageClass =
    uid === auth.currentUser.uid ? "flex-row-reverse self-end" : "";

  if (loading) {
    return (
      <>
        <div className={`flex items-center gap-1 ${messageClass}`}>
          <img
            src={defaultPic}
            alt="user"
            width="45"
            className={`rounded animate-pulse`}
          />
          <div
            className={`flex flex-col p-1 gap-1 ${
              uid === auth.currentUser.uid ? "items-end" : "items-start"
            }`}
          >
            <p className={`text-xs text-blue-900 dark:text-blue-50`}>
              <span className="animate-spin">
                <i className="ri-loader-5-line"></i>
              </span>
            </p>

            <p className="p-1 bg-blue-100 rounded-lg text-slate-900 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      </>
    );
  } else if (error) {
    return <Error error={error} content={"message"} />;
  } else {
    return (
      <>
        <div className={`flex items-center gap-1 ${messageClass}`}>
          {photoStatus()}
          <div
            className={`flex flex-col p-1 gap-1 ${
              uid === auth.currentUser.uid ? "items-end" : "items-start"
            }`}
          >
            <p
              className={`text-sm chat-info-text`}
            >
              {nameStatus()}
            </p>

            <p
              className="chat-msg-box"
              onClick={() => setDisplayTimeStamp(!displayTimeStamp)}
            >
              {text}
            </p>
            {displayTimeStamp && (
              <p
                className={`text-xs chat-info-text`}
              >
                {createdAt.toDate().toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
}
