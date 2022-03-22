import defaultPic from "../images/cloud-fill.png";
import { auth, db } from "../backend/firebase-config";
import { doc, getDoc, collection } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function ChatMessage(props) {
  const { text, uid } = props.message;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);

  const nameStatus = () => {
    if (loading) {
      return (
        <span className="animate-spin">
          <i className="ri-loader-5-line"></i>
        </span>
      );
    } else if (account) {
      return account.userName || account.name;
    } else {
      return (
        <>
          <i className="ri-error-warning-line"></i> Error loading username
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
            <p className={`text-xs text-blue-900`}>
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
  } else if (account) {
    return (
      <>
        <div className={`flex items-center gap-1 ${messageClass}`}>
          <img
            src={account.photoURL || defaultPic}
            alt="user"
            width="45"
            className={`rounded`}
          />
          <div
            className={`flex flex-col p-1 gap-1 ${
              uid === auth.currentUser.uid ? "items-end" : "items-start"
            }`}
          >
            <p className={`text-xs text-blue-900`}>{nameStatus()}</p>

            <p className="p-1 bg-blue-100 rounded-lg text-slate-900">{text}</p>
          </div>
        </div>
      </>
    );
  } else if (error) {
    return <main className="main-box">{`Error Loading Content :(`}</main>;
  }
}
