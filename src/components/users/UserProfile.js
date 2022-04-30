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
import { db } from "../../backend/firebase-config";
import FollowList from "./FollowList";
import DefaultScreen from "./DefaultScreen";
import Loading from "../loading-error-display/Loading";
import Error from "../loading-error-display/Error";

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
          <div>
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
            <DefaultScreen
              setOpenFollowList={setOpenFollowList}
              setSelectFollowList={setSelectFollowList}
              selectedAccount={selectedAccount}
              user={user}
              followCheck={followCheck}
              unFollowUser={unFollowUser}
              followUser={followUser}
              sendMessage={sendMessage}
              setScreen={setScreen}
            />
          )}
        </section>

        {/* Follower/Following Screen */}
        
        {openFollowList && (
          <FollowList
            selectFollowList={selectFollowList}
            accountsLoading={accountsLoading}
            accountsError={accountsError}
            accounts={accounts}
            selectedAccount={selectedAccount}
            setAccountSelection={setAccountSelection}
            setOpenFollowList={setOpenFollowList}
            setScreen={setScreen}
          />
        )}
      </>
    );
  }
}