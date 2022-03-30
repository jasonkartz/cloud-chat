import { useState } from "react";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../backend/firebase-config";
import UpdateProfileImage from "./user-settings-page/UpdateProfileImage";
import UpdateUserName from "./user-settings-page/UpdateUserName";
import UpdateName from "./user-settings-page/UpdateName";
import UpdateEmail from "./user-settings-page/UpdateEmail";
import UpdatePassword from "./user-settings-page/UpdatePassword";
import DeleteAccount from "./user-settings-page/DeleteAccount";
import AddSignin from "./user-settings-page/AddSignin";

export default function UserSettings() {
  const currentUser = auth.currentUser;
  const { uid, email } = currentUser;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);

  const [keyForRemount, setKeyForRemount] = useState(1)

  /* collect all sign-in poviders linked to user */
  const providerIdList = [];

  if (currentUser !== null) {
    currentUser.providerData.forEach((profile) => {
      providerIdList.push(profile.providerId);
    });
  }

  /* reusable reauthentication function */
  const reauthenticate = (password) => {
    const credential = EmailAuthProvider.credential(email, password);
    reauthenticateWithCredential(currentUser, credential);
  };

  if (loading) {
    return (
      <main className="main-box">
        <h2 className="flex gap-1 blue-heading">
          Loading
          <div className="animate-spin">
            <i className="ri-loader-5-line"></i>
          </div>
        </h2>
      </main>
    );
  } else if (account) {
    return (
      <>
        <main className="main-box">
          {providerIdList.length < 2 && (
            <AddSignin
              reauthenticate={reauthenticate}
              providerIdList={providerIdList}
              key={keyForRemount}
              setKeyForRemount={setKeyForRemount}
            />
          )}

          <UpdateProfileImage account={account} accountRef={accountRef} />

          <UpdateUserName account={account} accountRef={accountRef} />

          <UpdateName account={account} accountRef={accountRef} />

          <UpdateEmail
            accountRef={accountRef}
            reauthenticate={reauthenticate}
            providerIdList={providerIdList}
          />

          <UpdatePassword
            reauthenticate={reauthenticate}
            providerIdList={providerIdList}
          />

          <DeleteAccount
            account={account}
            accountRef={accountRef}
            reauthenticate={reauthenticate}
            providerIdList={providerIdList}
          />
        </main>
      </>
    );
  } else if (error) {
    return <main className="main-box">{`Error Loading Content :(`}</main>;
  }
}

/*
todo:
- password reset email link (ie. "forgot password")
- confirmation email for making changes in settings / account deletion
- user generated chatrooms
- private messaging
- switchable dark mode
- allow users to load previous messages after scrolling up
- allow users to view other user profiles
- timestamp messages
*/
