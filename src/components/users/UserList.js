import defaultPic from "../../images/cloud-fill.png";
import {
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Error from "../loading-error-display/Error";
import Loading from "../loading-error-display/Loading";
import {
  collection,
  orderBy,
  query,
  limitToLast,
} from "firebase/firestore";
import { useState, } from "react";
import { db } from "../../backend/firebase-config";

export default function UserList({
  user,
  setAccountSelection,
  setScreen,
}) {

  const [usersLimit, setUsersLimit] = useState(20);

  const accountsRef = collection(db, "accounts");
  const accountsQ = query(
    accountsRef,
    orderBy("name"),
    limitToLast(usersLimit)
  );
  const [accounts, loading, error, snapshot] = useCollectionData(accountsQ);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error />;
  } else {
    return (
      <ul>
        {accounts.map((account, index) => {
          return (
            account.uid !== user.uid && (
              <li
                className="user-list-display"
                key={index}
                onClick={() => {
                  setAccountSelection(account.uid);
                  setScreen("profile");
                }}
              >
                <img
                  src={account.photoURL || defaultPic}
                  alt="user"
                  width="25"
                  className="self-center rounded"
                />
                <span className="flex flex-col">
                  <p>{account.userName || account.name} </p>
                  <p className="text-sm">{account.userName && account.name}</p>
                </span>
              </li>
            )
          );
        })}
        {accounts.length === usersLimit && (
          <li>
            <button
              className="load-more-btn"
              onClick={() => setUsersLimit(usersLimit + 20)}
            >
              Load more...
            </button>
          </li>
        )}
      </ul>
    );
  }
}
