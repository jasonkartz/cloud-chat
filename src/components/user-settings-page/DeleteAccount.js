import { useState } from "react";
import { storage, auth } from "../../backend/firebase-config";
import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { listAll, deleteObject, ref } from "firebase/storage";

export default function DeleteAccount(props) {
  const currentUser = auth.currentUser;
  const { uid } = currentUser;
  const accountRef = props.accountRef;

  const [display, setDisplay] = useState(false);

  const [passwordForm, setPasswordForm] = useState("");

  const [deleteForm, setDeleteForm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteView, setDeleteView] = useState(false);

  const deleteConfirm = async () => {
    setDeleteStatus("Authenticating...");

    await props.reauthenticate(passwordForm);

    if (deleteForm === "DELETE") {
      setPasswordForm("");
      setDeleteView(true);
      setDeleteStatus(
        "Are you sure you want to delete your account? This will be permanent and cannot be recovered."
      );
    } else {
      setDeleteStatus(
        "Please type 'DELETE' in the box above before submitting."
      );
      setDeleteForm("");
      setTimeout(() => setDeleteStatus(""), 5000);
    }
  };

  const deleteCancel = () => {
    setDeleteView(false);
    setDeleteForm("");
    setDeleteStatus("Whew... that was a close one!");
    setTimeout(() => setDeleteStatus(""), 5000);
  };

  const deleteAccount = async () => {
    setDeleteStatus("Deleting account...");
    const userStorage = ref(storage, "users/" + uid);
    if (userStorage) {
      await listAll(userStorage)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    await deleteUser(currentUser)
      .then(() => {
        deleteDoc(accountRef);
      })
      .catch((error) => {
        console.log(error.code + " " + error.message);
        setDeleteStatus("Error deleting account. Please try again.");
        setDeleteForm("");
        setDeleteView(false);
        setTimeout(() => setDeleteStatus(""), 5000);
      });
  };

  return (
    props.providerIdList.includes("password") && (
      <section className="border-b-2 border-blue-200 settings-section">
        <h2
          className="blue-heading hover:cursor-pointer hover:text-blue-500"
          onClick={() => setDisplay(!display)}
        >
          Delete Account
          <i
            className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}
          ></i>
        </h2>
        {display && (
          <>
            {!deleteView && (
              <>
                <input
                  type="text"
                  placeholder="Type DELETE in all caps"
                  className="form-input"
                  value={deleteForm}
                  onChange={(e) => setDeleteForm(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input"
                  value={passwordForm.delete}
                  onChange={(e) => setPasswordForm(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn"
                  disabled={!deleteForm || !passwordForm}
                  onClick={deleteConfirm}
                >
                  Delete Account
                </button>
              </>
            )}
            
            <p>{deleteStatus}</p>

            {deleteView && (
              <div className="flex gap-2 pb-8">
                <button className="btn" onClick={deleteAccount}>
                  Yes
                </button>
                <button className="btn" onClick={deleteCancel}>
                  No
                </button>
              </div>
            )}
          </>
        )}
      </section>
    )
  );
}
