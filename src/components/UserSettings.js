import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { storage, auth, db } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings(props) {
  const types = ["image/jpeg", "image/png"];
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const { uid, displayName, email, photoURL } = auth.currentUser;
  const accountRef = doc(db, "accounts", auth.currentUser.uid);

  let progress;

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
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            updateDoc(accountRef, { name: displayName });
            setFile(null);
          })
          .catch((error) => {
            setUploadStatus("error");
            setFile(null);
          });
      }
    );
  };

  return (
    <>
      <main className="main-box">
        {/* USER IMAGE */}
        <section className="settings-section">
          <h2 className="blue-heading">Profile Image</h2>
          <img
            src={auth.currentUser.photoURL}
            alt="user"
            width="100"
            className="rounded"
          />

          <input type="file" onChange={handleImage} />
          {file && (
            <div className="text-blue-50">File selected: {file.name}</div>
          )}
          <button
            type="submit"
            className={`btn`}
            disabled={!file || uploadStatus === "uploading"}
            onClick={imageSubmit}
          >
           {uploadStatus === "uploading" ? <div className="flex gap-1">Uploading <div className="animate-spin"><i className="ri-loader-5-line"></i></div></div> : "Upload Image"}
          </button>
          
          {uploadStatus === "uploading" ? "Uploading..." + progress + "%" :
          uploadStatus === "complete" ? "Image updated!" :
          uploadStatus === "error" ? "An error occured" : ""}
        </section>

        {/* DISPLAY NAME */}
        <section className="settings-section">
          <h2 className="blue-heading">Display Name</h2>

          <input
            type="text"
            placeholder={auth.currentUser.displayName}
            className="form-input"
          />
          <button type="submit" className="btn">
            Change Display Name
          </button>
        </section>

        {/* EMAIL */}
        <section className="settings-section">
          <h2 className="blue-heading">Email</h2>

          <input
            type="text"
            placeholder={auth.currentUser.email}
            className="form-input"
          />
          <button type="submit" className="btn">
            Change Email
          </button>
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
}
