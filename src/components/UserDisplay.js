import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../backend/firebase-config";

export default function UserDisplay({ user, setOpenMenu, setScreen, setChatSelection }) {
  const accountRef = doc(db, "accounts", user.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  if (accountLoading) {
    return (
      <div className="animate-spin">
        <i className="ri-loader-5-line"></i>
      </div>
    );
  } else if (accountError) {
    return (
      <p className="text-red-800">
        <i className="ri-error-warning-line"></i> Error Loading Content
      </p>
    );
  } else {
    return (
      <div
        className="user-display-container"
        onClick={() => {
          setChatSelection(user.uid)
          setOpenMenu(true);
          setScreen("profile");
        }}
      >
        {account.userName || account.name}
        {account.photoURL && (
          <img
            src={account.photoURL}
            alt="user"
            className="user-display-image"
            width="30"
          />
        )}
      </div>
    );
  }
}
