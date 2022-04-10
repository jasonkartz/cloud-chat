import defaultPic from "../images/cloud-fill.png";
import { doc, getDoc, collection } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../backend/firebase-config";
import Loading from "./Loading";
import Error from "./Error";

export default function Profile({ user }) {
  const accountRef = doc(db, "accounts", user.uid);
  const [account, loading, error] = useDocumentData(accountRef);

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
          <p>Last Login: {account.lastLogin.toDate().toDateString()}</p>
      </section>
    );
  }
}
