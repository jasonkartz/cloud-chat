import { useState } from "react";
import { auth } from "../../backend/firebase-config";
import { updatePassword } from "firebase/auth";

export default function UpdatePassword(props) {
  const currentUser = auth.currentUser;

  const [display, setDisplay] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");

  const passwordSubmit = async () => {
    setPasswordStatus("Updating password...");

    await props.reauthenticate(passwordForm.current);

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
    props.providerIdList.includes("password") && (
      <section className="border-b-2 border-blue-200 settings-section">
        <h2
          className="blue-heading hover:cursor-pointer hover:text-blue-500"
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
              className="form-input"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Enter your new password"
              className="form-input"
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
