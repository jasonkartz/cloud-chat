import { useState } from "react";
import { updateDoc } from "firebase/firestore";

export default function UpdateUserName({account, accountRef}) {

  const [display, setDisplay] = useState(false);

  const [userNameForm, setUserNameForm] = useState("");
  const [userNameStatus, setUserNameStatus] = useState("");

  const userNameSubmit = async () => {
    setUserNameStatus("Updating Username...");
    await updateDoc(accountRef, { userName: userNameForm }).then(() => {
      setUserNameStatus("Username Updated: " + userNameForm);
      setUserNameForm("");
      setTimeout(() => setUserNameStatus(""), 5000);
    });
  };

  return (
    <section className="settings-section settings-section-border">
      <h2
        className="heading heading-hover"
        onClick={() => setDisplay(!display)}
      >
        User Name{" "}
        <i
          className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}
        ></i>
      </h2>

      {display && (
        <>
          <input
            type="text"
            placeholder={account.userName || "Create User Name"}
            className="text-input"
            value={userNameForm}
            onChange={(e) => setUserNameForm(e.target.value)}
          />
          <button
            type="submit"
            className="btn"
            onClick={userNameSubmit}
            disabled={!userNameForm}
          >
            {account.userName ? "Update User Name" : "Create User Name"}
          </button>
          <p>{userNameStatus}</p>
        </>
      )}
    </section>
  );
}
