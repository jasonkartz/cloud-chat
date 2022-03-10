import defaultPic from "../images/cloud-fill.png";
import { auth } from "../backend/firebase-config";

export default function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass =
    uid === auth.currentUser.uid ? "flex-row-reverse self-end" : "";

  return (
    <>
      <div className={`flex items-center gap-1 ${messageClass}`}>
        <img
          src={photoURL || defaultPic}
          alt="user"
          width="45"
          className="rounded"
        />
        <div className={`flex flex-col p-1 gap-1 ${uid === auth.currentUser.uid ? "items-end":"items-start"}`}>
          <p className="text-blue-900 text-xs">{displayName || ""}</p>

          <p className="text-slate-900 bg-blue-100 p-1 rounded-lg">{text}</p>
        </div>
      </div>
    </>
  );
}
