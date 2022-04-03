import { useState } from "react";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../backend/firebase-config";
import UpdateProfileImage from "./UpdateProfileImage";
import UpdateUserName from "./UpdateUserName";
import UpdateName from "./UpdateName";
import UpdateEmail from "./UpdateEmail";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";
import AddSignin from "./AddSignin";
import Error from "../Error";
import Loading from "../Loading";


export default function UserSettings() {
  const currentUser = auth.currentUser;
  const { uid, email } = currentUser;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);

  const [keyForRemount, setKeyForRemount] = useState(1);

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
      <div className="drop-menu-container">
        <Loading />
      </div>
    );
  } else if (account) {
    return (
      <div className="drop-menu-container">
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
      </div>
    );
  } else if (error) {
    return <div className="drop-menu-container"><Error /></div>;
  }
}

/*
todo:
- password reset email link (ie. "forgot password")
- confirmation email for making changes in settings / account deletion
*/
