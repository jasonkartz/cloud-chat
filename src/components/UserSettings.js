import { useUpdateProfile } from "react-firebase-hooks/auth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings(props) {
  const types = ["image/jpeg", "image/png"];

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImage = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError("Please select an image file (png or jpeg)");
    }
  };

  const imageSubmit = () => {
    
    let fileRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done')
    });
  };

  return (
    <>
      <main className="main-box">
        <section className="settings-section">
          <h2 className="blue-heading">Profile Image</h2>
          <img
            src={props.user.photoURL}
            alt="user"
            width="100"
            className="rounded"
          />
          <div className="settings-form">
            <input type="file" onChange={handleImage} />
            <button
              type="submit"
              className="btn"
              onClick={imageSubmit}
            >
              Upload Image
            </button>
            {error && <div className="text-red-500 error">{error}</div>}
            {file && <div className="error">{file.name}</div>}
          </div>
        </section>
        <section className="settings-section">
          <h2 className="blue-heading">Display Name</h2>
          <form className="settings-form">
            <input
              type="text"
              placeholder={props.user.displayName}
              className="form-input"
            />
            <button type="submit" className="btn">
              Change Display Name
            </button>
          </form>
        </section>
        <section className="settings-section">
          <h2 className="blue-heading">Email</h2>
          <form className="settings-form">
            <input
              type="text"
              placeholder={props.user.email}
              className="form-input"
            />
            <button type="submit" className="btn">
              Change Email
            </button>
          </form>
        </section>
        <section className="settings-section">
          <h2 className="blue-heading">Password</h2>
          <form className="settings-form">
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
          </form>
        </section>
        <section className="settings-section">
          <h2 className="blue-heading">Delete Account</h2>
          <form className="settings-form">
            <input
              type="text"
              placeholder="Type DELETE in all caps"
              className="form-input"
            />
            <button type="submit" className="btn">
              Delete Account
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
