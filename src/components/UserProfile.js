import defaultPic from "../images/cloud-fill.png";
import { doc, getDoc, collection, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
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
  const accountRef = doc(db, "accounts", accountSelection);
  const [account, loading, error] = useDocumentData(accountRef);

  const userAccountRef = doc(db, "accounts", user.uid);

  const followUser = () => {
    updateDoc(userAccountRef, {
      following: arrayUnion(account.uid)
    })

    updateDoc(accountRef, {
      followers: arrayUnion(user.uid)
    })
    
  }

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error />;
  } else {
    return (
      <section className="settings-section">
        <h1 className="blue-heading">{account.name}</h1>
        <img
          src={account.photoURL || defaultPic}
          alt="user"
          width="100"
          className="rounded"
        />
        {account.uid !== user.uid && (
          <button className="flex items-center gap-1 btn"
          onClick={followUser}
          >
            <i className="ri-user-follow-line"></i>
            <span>Follow</span>
          </button>
        )}
        <p>Last Login: {account.lastLogin.toDate().toDateString()}</p>
        {account.uid !== user.uid && (
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
