import defaultPic from "../images/cloud-fill.png";
import {
  doc,
  orderBy,
  limitToLast,
  collection,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { useDocumentData, useCollectionData, } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { auth, db } from "../backend/firebase-config";
import Loading from "./Loading";
import Error from "./Error";

export default function Profile({
  user,
  accountSelection,
  setAccountSelection,
  setScreen,
}) {
  const [openFollowList, setOpenFollowList] = useState(false);
  const [selectFollowList, setSelectFollowList] = useState("following");

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

  const accountsRef = collection(db, "accounts");
  const accountsQ = query(accountsRef, orderBy("name"), limitToLast(25));
  const [accounts, accountsLoading, accountsError, snapshot] =
    useCollectionData(accountsQ);

  if (selectedAccountLoading || userLoading) {
    return <Loading />;
  } else if (selectedAccountError || userError) {
    return <Error />;
  } else {
    const followCheck = userAccount.following.includes(selectedAccount.uid);
    const followBackCheck = selectedAccount.following.includes(userAccount.uid);

    const followDisplay =
      followCheck && followBackCheck
        ? "Following eachother"
        : followCheck
        ? "Following"
        : followBackCheck
        ? "Follows you"
        : "";

    return (
      <section className="settings-section">
        <div className="">
          <h1 className="blue-heading">{selectedAccount.name}</h1>
          <p className="text-sm italic">{followDisplay}</p>
        </div>

        {/* Default screen */}

        {!openFollowList && (
          <>
            <p className="font-bold">
              <span
                className="hover:cursor-pointer"
                onClick={() => {
                  setOpenFollowList(true)
                  setSelectFollowList("following")
                }}
              >
                Followers{" "}
                {selectedAccount.followers
                  ? selectedAccount.followers.length
                  : "0"}
              </span>{" "}
              |{" "}
              <span
                className="hover:cursor-pointer"
                onClick={() => {
                  setOpenFollowList(true)
                  setSelectFollowList("followers")
                }}
              >
                Following{" "}
                {selectedAccount.following
                  ? selectedAccount.following.length
                  : "0"}
              </span>
            </p>

            <img
              src={selectedAccount.photoURL || defaultPic}
              alt="user"
              width="100"
              className="rounded"
            />

            {selectedAccount.uid !== user.uid && (
              <button
                className="flex items-center gap-1 btn"
                onClick={followCheck ? unFollowUser : followUser}
              >
                <i
                  className={`ri-user-${
                    followCheck ? "unfollow" : "follow"
                  }-line`}
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
          </>
        )}

        {/* Follower/Following Screen */}

        {openFollowList && (
          <>
            <div className="flex gap-5">
              {" "}
              <h1>Follow List</h1>
              <button onClick={() => setOpenFollowList(false)}>
                <i className="ri-close-circle-line"></i>
              </button>
            </div>
            <ul>
              {accounts.map((account, index) => {
                return (
                  account[selectFollowList].includes(selectedAccount.uid) && (
                    <li
                      className="flex gap-2 p-1 border-b border-blue-200 hover:rounded hover:cursor-pointer hover:bg-blue-50/50 hover:text-blue-600"
                      key={index}
                      onClick={() => {
                        setAccountSelection(account.uid);
                        setOpenFollowList(false)
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
                        <p className="text-sm">
                          {account.userName && account.name}
                        </p>
                      </span>
                    </li>
                  )
                );
              })}
            </ul>
          </>
        )}
      </section>
    );
  }
}
