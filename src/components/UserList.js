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
  serverTimestamp,
  addDoc,
  doc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../backend/firebase-config";

export default function UserList() {
  const accountsRef = collection(db, "accounts");
  const accountsQ = query(accountsRef, orderBy("name"), limitToLast(25));
  const [accounts, loading, error, snapshot] = useCollectionData(accountsQ);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error />;
  } else {
    return (
      <ul>
        {accounts &&
          accounts.map((account) => {
            return (
              <>
                <li className="flex gap-2 mb-2">
                  <img
                    src={account.photoURL || defaultPic}
                    alt="user"
                    width="25"
                    className="self-center rounded"
                  />
                  <span className="flex flex-col">
                    <p>{account.userName || account.name}{" "}</p>
                    <p className="text-sm">{account.userName && account.name}</p>
                  </span>
                </li>
              </>
            );
          })}
      </ul>
    );
  }
}
