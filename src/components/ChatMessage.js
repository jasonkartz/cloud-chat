import defaultPic from "../images/cloud-fill.png";
import { auth } from "../backend/firebase-config";

export default function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass =
    uid === auth.currentUser.uid ? "flex-row-reverse self-end" : "";

  return (
    <>
      <div className={`flex items-end gap-1 ${messageClass}`}>
        <img
          src={photoURL || defaultPic}
          alt="user"
          width="45"
          className="rounded"
        />
        <div className="flex flex-col items-end">
          <p className="text-blue-800">{displayName || ""}</p>

          <p className="p-1 bg-blue-100 rounded-lg text-slate-900">{text}</p>
        </div>
      </div>
    </>
  );
}
