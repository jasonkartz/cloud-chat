import { useState } from "react";
import { auth } from "../../backend/firebase-config";
import { updateProfile } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

export default function UpdateName(props) {
  const currentUser = auth.currentUser;
  const accountRef = props.accountRef;
  const account = props.account;

  const [display, setDisplay] = useState(false);

  const [nameForm, setNameForm] = useState("");
  const [nameStatus, setNameStatus] = useState("");

  const nameSubmit = async () => {
    setNameStatus("Updating name...");

    await updateProfile(currentUser, { displayName: nameForm }).then(() =>
      updateDoc(accountRef, { name: nameForm }).then(() => {
        setNameStatus("Name updated: " + nameForm);
        setNameForm("");
        setTimeout(() => setNameStatus(""), 5000);
      })
    );
  };

  return (
    <section className="border-b-2 border-blue-200 settings-section ">
      <h2
        className="blue-heading hover:cursor-pointer hover:text-blue-500"
        onClick={() => setDisplay(!display)}
      >
        Name{" "}
        <i
          className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}
        ></i>
      </h2>

      {display && (
        <>
          <input
            type="text"
            placeholder={account.name}
            className="form-input"
            value={nameForm}
            onChange={(e) => setNameForm(e.target.value)}
          />
          <button
            type="submit"
            className="btn"
            disabled={!nameForm}
            onClick={nameSubmit}
          >
            Change Name
          </button>
          <p>{nameStatus}</p>
        </>
      )}
    </section>
  );
}
