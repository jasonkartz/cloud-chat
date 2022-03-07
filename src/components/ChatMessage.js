import defaultPic from "../images/cloud-fill.png";
import { auth } from "../backend/firebase-config";


export default function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;


  const messageClass = uid === auth.currentUser.uid ? "flex-row-reverse self-end" : "";
  
  return (
    <>
      <div className={`flex items-center gap-1 ${messageClass}`}>
        <img src={photoURL || defaultPic} alt="user" width="45" className="rounded-full" />
        <p className="p-2 bg-blue-100 rounded-full">{text}</p>
      </div>
    </>
  );
}
