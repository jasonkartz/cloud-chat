import defaultPic from "../images/cloud-fill.png";
import {
  doc,
  orderBy,
  limitToLast,
  collection,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useState } from "react";
import { db } from "../backend/firebase-config";
import Loading from "./Loading";
import Error from "./Error";

export default function Profile({
  user,
  accountSelection,
  setAccountSelection,
  setScreen,
  setChatSelection,
  setOpenMenu,
  account,
  accountLoading,
  accountError,
  accountRef,
}) {

  const [openFollowList, setOpenFollowList] = useState(false);
  const [selectFollowList, setSelectFollowList] = useState("following");

  const selectedAccountRef = doc(db, "accounts", accountSelection);
  const [selectedAccount, selectedAccountLoading, selectedAccountError] =
    useDocumentData(selectedAccountRef);

  const selectedAccountPrivateChatRef = doc(
    db,
    "accounts",
    accountSelection,
    "privateChats",
    user.uid
  );
  const [
    selectedAccountPrivateChat,
    selectedAccountPrivateChatLoading,
    selectedAccountPrivateChatError,
  ] = useDocumentData(selectedAccountPrivateChatRef);

  const userPrivateChatRef = doc(
    db,
    "accounts",
    user.uid,
    "privateChats",
    accountSelection
  );
  const [userPrivateChat, userPrivateChatLoading, userPrivateChatError] =
    useDocumentData(userPrivateChatRef);

  const sendMessage = async () => {
    if (userPrivateChat || selectedAccountPrivateChat) {
      setChatSelection({
        id: userPrivateChat.chatID,
        name: `You and ${selectedAccount.userName || selectedAccount.name}`,
        path: userPrivateChat.chatPath + "/messages",
      });
      setOpenMenu(false);
    } else {
      const userChatRef = doc(
        db,
        "accounts",
        user.uid,
        "privateChats",
        selectedAccount.uid
      );
      const selectedAccountChatRef = doc(
        db,
        "accounts",
        selectedAccount.uid,
        "privateChats",
        user.uid
      );

      const newChatRef = doc(collection(db, "privateChats"));
      await setDoc(newChatRef, {
        id: newChatRef.id,
        users: [user.uid, selectedAccount.uid],
      }).then(() => {
        setDoc(userChatRef, {
          chatID: newChatRef.id,
          withUser: selectedAccount.uid,
          chatPath: newChatRef.path,
        });
        setDoc(selectedAccountChatRef, {
          chatID: newChatRef.id,
          withUser: user.uid,
          chatPath: newChatRef.path,
        });
        setChatSelection({
          id: newChatRef.id,
          name: `You and ${selectedAccount.userName || selectedAccount.name}`,
          path: "/privateChats/" + newChatRef.id + "/messages",
        });
        setOpenMenu(false);
      });
    }
  };

  const followUser = async () => {
    updateDoc(accountRef, {
      following: arrayUnion(selectedAccount.uid),
    });

    updateDoc(selectedAccountRef, {
      followers: arrayUnion(user.uid),
    });
  };

  const unFollowUser = () => {
    updateDoc(accountRef, {
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

  if (selectedAccountLoading || accountLoading) {
    return <Loading />;
  } else if (selectedAccountError || accountError) {
    return <Error />;
  } else {
    const followCheck = account.following.includes(selectedAccount.uid);
    const followBackCheck = selectedAccount.following.includes(account.uid);

    const followDisplay =
      followCheck && followBackCheck
        ? "Following eachother"
        : followCheck
        ? "Following"
        : followBackCheck
        ? "Follows you"
        : "";

    return (
      <>
        <section className="settings-section">
          {openFollowList && (
            <button
              className="profile-back-btn"
              onClick={() => setOpenFollowList(false)}
            >
              <i className="ri-arrow-go-back-line"></i>
              <span> Back to profile</span>
            </button>
          )}
          <div className="">
            <h1 className="heading">
              {selectedAccount.userName || selectedAccount.name}
            </h1>
            {selectedAccount.userName && (
              <p className="text-sm font-semibold">{selectedAccount.name}</p>
            )}
            <p className="text-sm italic">{followDisplay}</p>
          </div>

          {/* Default screen */}

          {!openFollowList && (
            <>
              <p className="font-bold">
                <span
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setOpenFollowList(true);
                    setSelectFollowList("following");
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
                    setOpenFollowList(true);
                    setSelectFollowList("followers");
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
                <div className="flex gap-2">
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
                  <button
                    className="flex items-center gap-1 btn"
                    onClick={() => sendMessage()}
                  >
                    <i className={`ri-chat-2-line`}></i>
                    <span>Message</span>
                  </button>
                </div>
              )}
              <p className="text-sm">
                Last Login:{" "}
                {selectedAccount.lastLogin &&
                  selectedAccount.lastLogin.toDate().toLocaleString()}
              </p>

              {selectedAccount.uid !== user.uid && (
                <p
                  className="profile-back-btn"
                  onClick={() => setScreen("users")}
                >
                  <i className="text-lg font-bold ri-arrow-go-back-line"></i>
                  <span>User List</span>
                </p>
              )}
            </>
          )}
        </section>

        {/* Follower/Following Screen */}

        {openFollowList && (
          <>
            <div className="flex flex-col">
              <h1 className="heading">
                {selectFollowList === "followers" ? "Following" : "Followers"}
              </h1>
            </div>
            <ul>
              {accounts.map((account, index) => {
                return (
                  account[selectFollowList].includes(selectedAccount.uid) && (
                    <li
                      className="user-list-display"
                      key={index}
                      onClick={() => {
                        setAccountSelection(account.uid);
                        setOpenFollowList(false);
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
      </>
    );
  }
}
