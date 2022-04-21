import defaultPic from "../images/cloud-fill.png";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Error from "./Error";
import Loading from "./Loading";
import {
  collection,
  orderBy,
  query,
  limitToLast,
  where,
  serverTimestamp,
  addDoc,
  doc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function UserList({
  user,
  accountSelection,
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
                className="flex gap-2 p-1 border-b border-blue-200 hover:rounded hover:cursor-pointer hover:bg-blue-50/50 hover:text-blue-600"
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
