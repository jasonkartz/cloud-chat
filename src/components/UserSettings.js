import defaultPic from "../images/cloud-fill.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile, updateEmail } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { storage, auth, db } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings(props) {
  const { uid, displayName, email } = auth.currentUser;
  const accountRef = doc(db, "accounts", uid);
  const [account, loading, error] = useDocumentData(accountRef);

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
    const imagePath =
      "users/" + props.user.uid + "/user-image." + file.name.split(".").pop();
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
    await updateProfile(auth.currentUser, { displayName: nameForm }).then(() =>
      updateDoc(accountRef, { name: nameForm }).then(() => {
        setNameStatus("Name updated: " + nameForm);
        setNameForm("");
        setTimeout(() => setNameStatus(""), 5000);
      })
    );
  };

  /* EMAIL */
  const [emailForm, setEmailForm] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const emailSubmit = async () => {
    await updateEmail(auth.currentUser, emailForm)
      .then(() => {
        updateDoc(accountRef, { email: emailForm }).then(() => {
          setEmailStatus("Email updated: " + emailForm);
          setEmailForm("");
          setTimeout(() => setEmailStatus(""), 5000);
        });
      })
      .catch((error) => {
        setEmailStatus("Error updating email. Please try again.");
        setEmailForm("");
        setTimeout(() => setEmailStatus(""), 5000);
      });
  };

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
    console.log(userNameForm);
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
            <button
              type="submit"
              className="btn"
              disabled={!emailForm}
              onClick={emailSubmit}
            >
              Change Email
            </button>
            <p>{emailStatus}</p>
          </section>

          {/* PASSWORD */}
          <section className="settings-section">
            <h2 className="blue-heading">Password</h2>

            <input
              type="text"
              placeholder="Enter Your Current Password"
              className="form-input"
            />
            <input
              type="text"
              placeholder="Enter Your New Password"
              className="form-input"
            />
            <button type="submit" className="btn">
              Change Password
            </button>
          </section>

          {/* DELETE ACCOUNT */}
          <section className="settings-section">
            <h2 className="blue-heading">Delete Account</h2>

            <input
              type="text"
              placeholder="Type DELETE in all caps"
              className="form-input"
            />
            <button type="submit" className="btn">
              Delete Account
            </button>
          </section>
        </main>
      </>
    );
  } else if (error) {
    return <main className="main-box">{`Error Loading Content :(`}</main>;
  }
}
