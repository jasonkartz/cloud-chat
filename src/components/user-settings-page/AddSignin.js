import { useState } from "react";
import { auth, googleAuth } from "../../backend/firebase-config";
import {
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
  reauthenticateWithPopup,
} from "firebase/auth";

export default function AddSignin(props) {
  const currentUser = auth.currentUser;
  const { email } = currentUser;

  const [display, setDisplay] = useState(false);


  const [passwordForm, setPasswordForm] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [status, setStatus] = useState("");

  const addPassword = async () => {
    const emailCredential = EmailAuthProvider.credential(email, passwordForm);

    setStatus("Reauthenticating...");

    await reauthenticateWithPopup(currentUser, googleAuth)
      .then(async () => {
        setStatus("Checking password...");

        if (passwordForm === passwordCheck) {
          setStatus("Creating new login credentials...");
          await linkWithCredential(currentUser, emailCredential)
            .then((userCredential) => {
              alert(`You can now sign in with email and password.`);
              setPasswordForm("");
              setPasswordCheck("")
              props.setKeyForRemount(2)
            })
            .catch((error) => {
              setStatus(`${error.message}`);
            });
        } else {
          setStatus("Passwords did not match! Try again.");
          setPasswordForm("");
          setPasswordCheck("");
        }
      })
      .catch((error) => {
        setStatus(`${error.message}`);
      });
  };

  const addGoogle = async () => {
    setStatus("Reauthenticating...");

    await props.reauthenticate(passwordForm.current);

    setStatus("Sign in to your Google account.");

    linkWithPopup(currentUser, googleAuth)
      .then((result) => {
        alert(`You can now sign in with your Google account.`);
        setPasswordForm("");
        props.setKeyForRemount(2)
      })
      .catch((error) => {
        setStatus(`${error.message}`);
      });
  };

  /* return if account has less than 2 sign in providers (Google and email/password are only options offered) */

  return (
    props.providerIdList.length < 2 && (
      <section className="border-b-2 border-blue-200 settings-section">
        {/* Displays add password sign in if the user only has Google option */}
        {props.providerIdList.includes("google.com") && (
          <>
            <h2
              className="blue-heading hover:cursor-pointer hover:text-blue-500"
              onClick={() => setDisplay(!display)}
            >
              Add a Password
              <i
                className={`ri-arrow-${
                  display ? "up" : "down"
                }-s-line align-sub`}
              ></i>
            </h2>
            {display && (
              <>
                <p>
                  If you would like to add email/password sign in to your
                  account, create a password below.
                </p>
                <p>You will be prompted to sign in with Google again.</p>
                <p>Email associated with this account: {email}</p>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="form-input"
                  value={passwordForm}
                  onChange={(e) => setPasswordForm(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Re-type password"
                  className="form-input"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />

                <button
                  type="submit"
                  className="btn"
                  disabled={!passwordForm || !passwordCheck}
                  onClick={addPassword}
                >
                  Submit
                </button>
                <p>{status}</p>
              </>
            )}
          </>
        )}

        {/* Displays add Google sign in if the user only has email/password option */}

        {props.providerIdList.includes("password") && (
          <>
            <h2
              className="blue-heading hover:cursor-pointer hover:text-blue-500"
              onClick={() => setDisplay(!display)}
            >
              Link Your Google Account
              <i
                className={`ri-arrow-${
                  display ? "up" : "down"
                }-s-line align-sub`}
              ></i>
            </h2>
            {display && (
              <>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input"
                  value={passwordForm}
                  onChange={(e) => setPasswordForm(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-1.5 btn"
                  onClick={addGoogle}
                  disabled={!passwordForm}
                >
                  <i className="p-1 text-blue-600 rounded ri-google-fill bg-slate-50"></i>{" "}
                  <span className="align-top">Sign in with Google</span>
                </button>
                <p>{status}</p>
              </>
            )}
          </>
        )}
      </section>
    )
  );
}
