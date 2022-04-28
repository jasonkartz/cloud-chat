import { useState } from "react";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../backend/firebase-config";
import UpdateProfileImage from "./UpdateProfileImage";
import UpdateUserName from "./UpdateUserName";
import UpdateName from "./UpdateName";
import UpdateEmail from "./UpdateEmail";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";
import AddSignin from "./AddSignin";
import Error from "../Error";
import Loading from "../Loading";

export default function UserSettings({
  accountRef,
  account,
  accountLoading,
  accountError,
  darkMode,
  setDarkMode,
  systemTheme,
  setSystemTheme,
}) {
  const currentUser = auth.currentUser;
  const { email } = currentUser;

  /* remounts component by changing the key property */
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

  if (accountLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (account) {
    return (
      <>
        <section className="settings-section settings-section-border">
          <label>
            <input
              type="checkbox"
              checked={systemTheme}
              onChange={() => {
                if (systemTheme === false) {
                  setSystemTheme(true);
                  localStorage.systemTheme = "true";
                  localStorage.removeItem("theme");
                  if (
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                  ) {
                    setDarkMode(true);
                  } else {
                    setDarkMode(false);
                  }
                } else {
                  setSystemTheme(false);
                  localStorage.removeItem("systemTheme");
                }
              }}
            />{" "}
            Use system theme
          </label>
        </section>
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
      </>
    );
  } else if (accountError) {
    return (
      <>
        <Error />
      </>
    );
  } else {
    return <Loading />;
  }
}

/*
todo:
- password reset email link (ie. "forgot password")
- confirmation email for making changes in settings / account deletion
*/
