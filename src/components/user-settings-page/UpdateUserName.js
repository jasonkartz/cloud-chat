import { useState } from "react";
import { updateDoc } from "firebase/firestore";

export default function UpdateUserName(props) {
  const accountRef = props.accountRef;
  const account = props.account;

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
    <section className="border-b-2 border-blue-200 settings-section ">
      <h2
        className="blue-heading hover:cursor-pointer hover:text-blue-500"
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
            className="form-input"
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
