import defaultPic from "../../images/cloud-fill.png";
import { auth, db } from "../../backend/firebase-config";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import Loading from "../loading-error-display/Loading";
import Error from "../loading-error-display/Error";

export default function ChatMessage({
  message,
  setOpenMenu,
  setAccountSelection,
  setScreen,
}) {
  const { text, uid, createdAt } = message;
  const msgAccountRef = doc(db, "accounts", uid);
  const [msgAccount, msgAccountLoading, msgAccountError] = useDocumentData(msgAccountRef);

  const [displayTimeStamp, setDisplayTimeStamp] = useState(false);

  const photoStatus = () => {
    if (msgAccountLoading) {
      return <Loading />;
    } else if (msgAccountError) {
      return <Error msgAccountError={msgAccountError} content={"user image"} />;
    } else if (msgAccount) {
      const userImage =
        msgAccount.photoURL === null ? defaultPic : msgAccount.photoURL;
      return (
        <img
          src={userImage}
          alt="user"
          className={`chat-image`}
          onClick={() => {
            setAccountSelection(uid);
            setScreen("profile");
            setOpenMenu(true);
          }}
        />
      );
    } else {
      return (
        <i className="text-2xl text-blue-900 ri-close-circle-line dark:text-blue-50"></i>
      );
    }
  };

  const nameStatus = () => {
    if (msgAccountLoading) {
      return <Loading />;
    } else if (msgAccount) {
      return msgAccount.userName || msgAccount.name;
    } else {
      return <>Deleted User</>;
    }
  };

  const messageClass =
    uid === auth.currentUser.uid ? "flex-row-reverse self-end" : "";

  if (msgAccountLoading) {
    return (
      <>
        <div className={`flex items-center gap-1 ${messageClass}`}>
          <img
            src={defaultPic}
            alt="user"
            width="45"
            className={`rounded animate-pulse object-contain`}
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
  } else if (msgAccountError) {
    return <Error msgAccountError={msgAccountError} content={"message"} />;
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
            <p className={`text-sm chat-info-text`}>{nameStatus()}</p>

            <p
              className="chat-text-bubble"
              onClick={() => setDisplayTimeStamp(!displayTimeStamp)}
            >
              {text}
            </p>
            {displayTimeStamp && (
              <p className={`text-xs chat-info-text`}>
                {createdAt.toDate().toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
}
