import { useState } from "react";
import { auth } from "../../backend/firebase-config";
import { updatePassword } from "firebase/auth";

export default function UpdatePassword({ reauthenticate, providerIdList }) {
  const currentUser = auth.currentUser;

  const [display, setDisplay] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");

  const passwordSubmit = async () => {
    setPasswordStatus("Updating password...");

    await reauthenticate(passwordForm.current);

    await updatePassword(currentUser, passwordForm.new)
      .then(() => {
        setPasswordStatus("Password updated");
        setPasswordForm({ ...passwordForm, current: "", new: "" });
        setTimeout(() => setPasswordStatus(""), 5000);
      })
      .catch((error) => {
        setPasswordStatus("Error: " + error.code + " Please try again.");
        setPasswordForm({ ...passwordForm, current: "", new: "" });
        setTimeout(() => setPasswordStatus(""), 5000);
      });
  };

  return (
    providerIdList.includes("password") && (
      <section className="settings-section settings-section-border">
        <h2
          className="heading heading-hover"
          onClick={() => setDisplay(!display)}
        >
          Password
          <i
            className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}
          ></i>
        </h2>
        {display && (
          <>
            <input
              type="password"
              placeholder="Enter your current password"
              className="text-input"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Enter your new password"
              className="text-input"
              value={passwordForm.new}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={!passwordForm.current || !passwordForm.new}
              className={`btn`}
              onClick={passwordSubmit}
            >
              Change Password
            </button>
            <p>{passwordStatus}</p>
          </>
        )}
      </section>
    )
  );
}
