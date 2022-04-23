import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../backend/firebase-config";
import Loading from "./Loading";
import Error from "./Error";

export default function UserDisplay({ user, setOpenMenu, setScreen, setAccountSelection }) {
  const accountRef = doc(db, "accounts", user.uid);
  const [account, accountLoading, accountError] = useDocumentData(accountRef);

  if (accountLoading) {
    return (
      <Loading />
    );
  } else if (accountError) {
    return (
      <Error error={accountError} content={"user info"} />
    );
  } else {
    return (
      <div
        className="user-display-container"
        onClick={() => {
          setAccountSelection(user.uid)
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