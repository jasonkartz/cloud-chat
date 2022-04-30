import { useState } from "react";
import { storage, auth, googleAuth, db } from "../../backend/firebase-config";
import {
  deleteUser,
  reauthenticateWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  deleteDoc,
  where,
  query,
  updateDoc,
  collection,
  getDocs,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { listAll, deleteObject, ref } from "firebase/storage";

export default function DeleteAccount({
  accountRef,
  providerIdList,
}) {
  const currentUser = auth.currentUser;
  const { uid, email } = currentUser;

  const [display, setDisplay] = useState(false);

  const [deleteForm, setDeleteForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");

  const [deleteStatus, setDeleteStatus] = useState("");

  const [deleteView, setDeleteView] = useState(false);

  /* clears user from other accounts follow lists when user deletes their account */
  const clearFollows = async () => {
    const accountsRef = collection(db, "accounts");

    /* checks for all accounts user is following */
    const followersQ = query(
      accountsRef,
      where("followers", "array-contains", uid)
    );
    const followersSnap = await getDocs(followersQ);

    /* checks for all accounts following user */
    const followingQ = query(
      accountsRef,
      where("following", "array-contains", uid)
    );
    const followingSnap = await getDocs(followingQ);

    /* removes user from other accounts followers list */
    followersSnap.forEach((account) => {
      const docRef = doc(db, "accounts", account.id);
      updateDoc(docRef, {
        followers: arrayRemove(uid),
      });
    });

    /* removes user from other accounts following list */
    followingSnap.forEach((account) => {
      const docRef = doc(db, "accounts", account.id);
      updateDoc(docRef, {
        following: arrayRemove(uid),
      });
    });
  };

  const deleteConfirm = async () => {
    setDeleteStatus("Authenticating...");

    const deleteCheck = () => {
      if (deleteForm === "DELETE") {
        setPasswordForm("");
        setDeleteForm("");
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

    if (providerIdList.includes("password")) {
      const credential = EmailAuthProvider.credential(email, passwordForm);
      await reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          deleteCheck();
        })
        .catch((error) => setDeleteStatus(error.message));
    } else {
      await reauthenticateWithPopup(currentUser, googleAuth)
        .then(() => {
          deleteCheck();
        })
        .catch((error) => setDeleteStatus(error.message));
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
    await clearFollows();
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
    await deleteDoc(accountRef)
      .then(() => {
        deleteUser(currentUser);
      })
      .catch((error) => {
        console.log(error.code + " " + error.message);
        setDeleteStatus("Error deleting account. Please try again.");
        setDeleteView(false);
        setTimeout(() => setDeleteStatus(""), 5000);
      });
  };

  return (
    <section className="settings-section settings-section-border">
      <h2
        className="heading heading-hover"
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
                className="text-input"
                value={deleteForm}
                onChange={(e) => setDeleteForm(e.target.value)}
              />

              {/* if user has a password sign in method, display this */}

              {providerIdList.includes("password") && (
                <>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="text-input"
                    value={passwordForm}
                    onChange={(e) => {
                      setPasswordForm(e.target.value);
                    }}
                  />
                  <button
                    type="submit"
                    className="btn"
                    disabled={!deleteForm || !passwordForm}
                    onClick={() => deleteConfirm()}
                  >
                    Delete Account
                  </button>
                </>
              )}
            </>
          )}

          {/* if user ONLY has a Google sign in method, display this */}

          {providerIdList.includes("google.com") &&
          providerIdList.length < 2 ? (
            <>
              <button
                type="submit"
                className="btn"
                disabled={!deleteForm}
                onClick={deleteConfirm}
              >
                Sign in again to proceed
              </button>
            </>
          ) : null}

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
  );
}
