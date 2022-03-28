import defaultPic from "../images/cloud-fill.png";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { storage, auth, db } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings() {
  const { uid, displayName, email } = auth.currentUser;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);

  /* collect all sign-in poviders linked to user */
  const providerIdList = [];

  if (auth.currentUser !== null) {
    auth.currentUser.providerData.forEach((profile) => {
      providerIdList.push(profile.providerId);
    });
  }

  /* reusable reauthentication function */
  const reauthenticate = (password) => {
    const credential = EmailAuthProvider.credential(email, password);
    reauthenticateWithCredential(auth.currentUser, credential);
  };

  /* USER IMAGE */

  const types = ["image/jpeg", "image/png"];
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImage = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setUploadStatus("Click 'Upload Image'.");
    } else {
      setFile(null);
      setUploadStatus("Please select an image file (png or jpeg)");
    }
  };

  const imageSubmit = () => {
    setUploadStatus("Updating image...");
    const imagePath =
      "users/" + uid + "/user-image." + file.name.split(".").pop();
    let fileRef = ref(storage, imagePath);
    const uploadRef = uploadBytesResumable(fileRef, file);

    uploadRef.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setUploadStatus("uploading");
      },
      () => (error) => {
        setUploadStatus("upload error");
      },
      async () => {
        const url = await getDownloadURL(fileRef);

        await updateProfile(auth.currentUser, { photoURL: url })
          .then(() => {
            setUploadStatus("complete");
            updateDoc(accountRef, { photoURL: url });
            setFile(null);
            setTimeout(() => setUploadStatus(""), 5000);
          })
          .catch((error) => {
            setUploadStatus("error");
            setFile(null);
          });
      }
    );
  };

  /* USER NAME */

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

  /* NAME */

  const [nameForm, setNameForm] = useState("");
  const [nameStatus, setNameStatus] = useState("");

  const nameSubmit = async () => {
    setNameStatus("Updating name...");

    await updateProfile(auth.currentUser, { displayName: nameForm }).then(() =>
      updateDoc(accountRef, { name: nameForm }).then(() => {
        setNameStatus("Name updated: " + nameForm);
        setNameForm("");
        setTimeout(() => setNameStatus(""), 5000);
      })
    );
  };

  /* PASSWORD */
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    email: "",
    delete: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");

  const passwordSubmit = async () => {
    setPasswordStatus("Updating password...");

    await reauthenticate(passwordForm.current);

    await updatePassword(auth.currentUser, passwordForm.new)
      .then(() => {
        setPasswordStatus("Password updated");
        setPasswordForm({ ...passwordForm, current: "", new: "" });
        setTimeout(() => setPasswordStatus(""), 5000);
      })
      .catch((error) => {
        setPasswordStatus("Error updating password. Please try again.");
        setPasswordForm({ ...passwordForm, current: "", new: "" });
        setTimeout(() => setPasswordStatus(""), 5000);
      });
  };

  /* EMAIL */
  const [emailForm, setEmailForm] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const emailSubmit = async () => {
    setEmailStatus("Updating email...");

    await reauthenticate(passwordForm.email);

    await updateEmail(auth.currentUser, emailForm)
      .then(() => {
        updateDoc(accountRef, { email: emailForm }).then(() => {
          setEmailStatus("Email updated: " + emailForm);
          setEmailForm("");
          setPasswordForm({ ...passwordForm, email: "" });
          setTimeout(() => setEmailStatus(""), 5000);
        });
      })
      .catch((error) => {
        setEmailStatus("Error updating email. Please try again.");
        setEmailForm("");
        setPasswordForm({ ...passwordForm, email: "" });
        setTimeout(() => setEmailStatus(""), 5000);
      });
  };

  /* Delete Account */

  const [deleteForm, setDeleteForm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteView, setDeleteView] = useState(false);

  const deleteConfirm = async () => {
    setDeleteStatus("Authenticating...");

    await reauthenticate(passwordForm.delete);

    if (deleteForm === "DELETE") {
      setPasswordForm({ ...passwordForm, delete: "" });
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
    await deleteUser(auth.currentUser)
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

  /* render form */

  if (loading) {
    return (
      <main className="main-box">
        <h2 className="flex gap-1 blue-heading">
          Loading
          <div className="animate-spin">
            <i className="ri-loader-5-line"></i>
          </div>
        </h2>
      </main>
    );
  } else if (account) {
    return (
      <>
        <main className="main-box">
          {/* USER IMAGE */}
          <section className="settings-section">
            <h2 className="blue-heading">Profile Image</h2>
            <img
              src={account.photoURL || defaultPic}
              alt="user"
              width="100"
              className="rounded"
            />

            <input type="file" onChange={handleImage} />
            {file && <div>File selected: {file.name}</div>}
            <button
              type="submit"
              className={`btn`}
              disabled={!file || uploadStatus === "uploading"}
              onClick={imageSubmit}
            >
              {uploadStatus === "uploading" ? (
                <div className="flex gap-1">
                  Uploading
                  <div className="animate-spin">
                    <i className="ri-loader-5-line"></i>
                  </div>
                </div>
              ) : (
                "Upload Image"
              )}
            </button>

            {uploadStatus === "uploading"
              ? "Uploading... " + uploadProgress + "%"
              : uploadStatus === "complete"
              ? "Image updated!"
              : uploadStatus === "error"
              ? "An error occured"
              : ""}
          </section>

          {/* USER NAME */}
          <section className="settings-section">
            <h2 className="blue-heading">User Name</h2>

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
          </section>

          {/* NAME */}
          <section className="settings-section">
            <h2 className="blue-heading">Name</h2>

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
          </section>

          {/* EMAIL */}
          {providerIdList.includes("password") && (
            <section className="settings-section">
              <h2 className="blue-heading">Email</h2>

              <input
                type="email"
                placeholder={email}
                className="form-input"
                value={emailForm}
                onChange={(e) => {
                  setEmailForm(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="form-input"
                value={passwordForm.email}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, email: e.target.value })
                }
              />
              <button
                type="submit"
                className="btn"
                disabled={!emailForm || !passwordForm.email}
                onClick={emailSubmit}
              >
                Change Email
              </button>
              <p>{emailStatus}</p>
            </section>
          )}

          {/* PASSWORD */}

          {providerIdList.includes("password") && (
            <section className="settings-section">
              <h2 className="blue-heading">Password</h2>
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
            </section>
          )}

          {/* DELETE ACCOUNT */}
          <section className="pb-8 settings-section">
            <h2 className="blue-heading">Delete Account</h2>

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
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, delete: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="btn"
                  disabled={!deleteForm || !passwordForm.delete}
                  onClick={deleteConfirm}
                >
                  Delete Account
                </button>
              </>
            )}
            <p>{deleteStatus}</p>
            {deleteView && (
              <div className="flex gap-2">
                <button className="btn" onClick={deleteAccount}>
                  Yes
                </button>
                <button className="btn" onClick={deleteCancel}>
                  No
                </button>
              </div>
            )}
          </section>
        </main>
      </>
    );
  } else if (error) {
    return <main className="main-box">{`Error Loading Content :(`}</main>;
  }
}

/*
todo:
- break up settings into components with their own state
- link signin providers (ie. allow google signin users to create email/pass signin method)
- password reset email link (ie. "forgot password")
- confirmation email for making changes in settings / account deletion
- user generated chatrooms
- private messaging
- switchable dark mode
- allow users to load previous messages after scrolling up
- allow users to view other user profiles
- timestamp messages
*/