import defaultPic from "../images/cloud-fill.png";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../backend/firebase-config";
import Loading from "./Loading";
import Error from "./Error";

export default function Profile({
  user,
  accountSelection,
  setAccountSelection,
  setScreen,
}) {
  const selectedAccountRef = doc(db, "accounts", accountSelection);
  const [selectedAccount, selectedAccountLoading, selectedAccountError] =
    useDocumentData(selectedAccountRef);

  const userAccountRef = doc(db, "accounts", user.uid);
  const [userAccount, userLoading, userError] = useDocumentData(userAccountRef);

  const followUser = () => {
    updateDoc(userAccountRef, {
      following: arrayUnion(selectedAccount.uid),
    });

    updateDoc(selectedAccountRef, {
      followers: arrayUnion(user.uid),
    });
  };

  const unFollowUser = () => {
    updateDoc(userAccountRef, {
      following: arrayRemove(selectedAccount.uid),
    });

    updateDoc(selectedAccountRef, {
      followers: arrayRemove(user.uid),
    });
  };

  if (selectedAccountLoading || userLoading) {
    return <Loading />;
  } else if (selectedAccountError || userError) {
    return <Error />;
  } else {
    const followCheck = userAccount.following.includes(selectedAccount.uid);

    return (
      <section className="settings-section">
        <h1 className="blue-heading">{selectedAccount.name}</h1>
        <img
          src={selectedAccount.photoURL || defaultPic}
          alt="user"
          width="100"
          className="rounded"
        />

        <p className="font-bold">
          <span>
            Followers{" "}
            {selectedAccount.followers ? selectedAccount.followers.length : "0"}
          </span>{" "}
          |{" "}
          <span>
            Following{" "}
            {selectedAccount.following ? selectedAccount.following.length : "0"}
          </span>
        </p>

        {selectedAccount.uid !== user.uid && (
          <button
            className="flex items-center gap-1 btn"
            onClick={followCheck ? unFollowUser : followUser}
          >
            <i
              className={`ri-user-${followCheck ? "unfollow" : "follow"}-line`}
            ></i>
            <span>{followCheck ? "Unfollow" : "Follow"}</span>
          </button>
        )}
        <p>
          Last Login:{" "}
          {selectedAccount.lastLogin &&
            selectedAccount.lastLogin.toDate().toDateString()}
        </p>
        {selectedAccount.uid !== user.uid && (
          <p
            className="flex items-center gap-1 hover:cursor-pointer hover:text-blue-500"
            onClick={() => setScreen("users")}
          >
            <i className="text-lg font-bold ri-arrow-go-back-line"></i>
            <span> Go Back</span>
          </p>
        )}
      </section>
    );
  }
}
