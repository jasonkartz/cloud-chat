import defaultPic from "../../images/cloud-fill.png";
import noUserPic from "../../images/cloud-off-fill-light.png";
import { db } from "../../backend/firebase-config";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Loading from "../loading-error-display/Loading";
import Error from "../loading-error-display/Error";

export default function PrivateChatUser({
  chat,
  setChatSelection,
  setOpenMenu,
}) {
  const { chatID, chatPath, withUser } = chat;
  const accountRef = doc(db, "accounts", withUser);
  const [account, loading, error] = useDocumentData(accountRef);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error error={error} content={"user"} />;
  } else if (account) {
    return (
      <li
        className="user-list-display"
        onClick={() => {
          setChatSelection({
            id: chatID,
            name: `You and ${account.userName || account.name}`,
            path: chatPath + "/messages",
          });
          setOpenMenu(false);
        }}
      >
        <img
          src={account.photoURL || defaultPic}
          alt="user"
          className="self-center profile-image size-list"
        />
        <span className="flex flex-col">
          <p>{account.userName || account.name} </p>
          <p className="text-sm">{account.userName && account.name}</p>
        </span>
      </li>
    );
  } else {
    return (
      <li className="user-list-display-error">
        <img
          src={noUserPic}
          alt="user"
          className="self-center profile-image size-list"
        />
        <span className="flex flex-col">
          <p>Deleted account</p>
        </span>
      </li>
    );
  }
}
