import { useUpdateProfile } from "react-firebase-hooks/auth";
import { ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../backend/firebase-config";
import { useState } from "react";

export default function UserSettings(props) {
  const types = ["image/jpeg", "image/png"];
  const [image, setImage] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  const [displayName, setDisplayName] = useState("");

  const [updateProfile, updating, error] = useUpdateProfile(auth);



  const imageUpload = () => {
    const imageRef = ref(storage, image.name);
    uploadBytes(imageRef, image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (updating) {
    return <p>Updating...</p>;
  }

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
          <form className="settings-form" onSubmit={imageUpload}>
            <input
              type="file"
              value={photoURL}
              onChange={(e) => e.target.files[0] && types.includes(e.target.type) && setImage(e.target.files[0])}
            />
            <button type="submit" className="btn">
              Change Photo
            </button>
          </form>
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
