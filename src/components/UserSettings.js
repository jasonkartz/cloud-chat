import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { storage, auth } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings(props) {
  const types = ["image/jpeg", "image/png"];
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

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
        setUploadStatus("Uploading... " + progress + "%");
      },
      () => (error) => {
        setUploadStatus("upload error");
      },
      async () => {
        const url = await getDownloadURL(fileRef);

        await updateProfile(auth.currentUser, { photoURL: url })
          .then(() => {
            setUploadStatus("Image updated!");
            setFile(null);
          })
          .catch((error) => {
            setUploadStatus("An error occured");
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
          <button type="submit" className="btn" disabled={!file} onClick={imageSubmit}>
            Upload Image
          </button>

          {uploadStatus && <div>{uploadStatus}</div>}
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
