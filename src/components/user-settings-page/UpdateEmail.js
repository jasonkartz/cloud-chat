import { useState } from "react";
import { auth } from "../../backend/firebase-config";
import { updateEmail } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

export default function UpdateEmail(props) {
  const currentUser = auth.currentUser;
  const { email } = currentUser;
  const accountRef = props.accountRef;

  const [display, setDisplay] = useState(false);

  const [emailForm, setEmailForm] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordForm, setPasswordForm] = useState("");

  const emailSubmit = async () => {
    setEmailStatus("Updating email...");

    await props.reauthenticate(passwordForm);

    await updateEmail(currentUser, emailForm)
      .then(() => {
        updateDoc(accountRef, { email: emailForm }).then(() => {
          setEmailStatus("Email updated: " + emailForm);
          setEmailForm("");
          setPasswordForm("");
          setTimeout(() => setEmailStatus(""), 5000);
        });
      })
      .catch((error) => {
        setEmailStatus("Error updating email. Please try again.");
        setEmailForm("");
        setPasswordForm("");
        setTimeout(() => setEmailStatus(""), 5000);
      });
  };

  return props.providerIdList.includes("password") && (
    <section className="settings-section settings-section-border">
      <h2
        className="heading heading-hover"
        onClick={() => setDisplay(!display)}
      >
        Email{" "}
        <i
          className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}
        ></i>
      </h2>
      {display && (
        <>
          <input
            type="email"
            placeholder={email}
            className="text-input"
            value={emailForm}
            onChange={(e) => {
              setEmailForm(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="text-input"
            value={passwordForm}
            onChange={(e) =>
              setPasswordForm(e.target.value)
            }
          />
          <button
            type="submit"
            className="btn"
            disabled={!emailForm || !passwordForm}
            onClick={emailSubmit}
          >
            Change Email
          </button>
          <p>{emailStatus}</p>
        </>
      )}
    </section>
  );
}
