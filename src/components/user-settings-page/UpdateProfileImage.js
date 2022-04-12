import defaultPic from "../../images/cloud-fill.png";
import { useState } from "react";
import { storage, auth } from "../../backend/firebase-config";
import { updateProfile } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

export default function UpdateProfileImage({account, accountRef}) {
  const currentUser = auth.currentUser;
  const { uid } = currentUser;

  const [display, setDisplay] = useState(false);

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

        await updateProfile(currentUser, { photoURL: url })
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

  return (
    <section className="border-b-2 border-blue-200 settings-section">
      <h2 className="blue-heading hover:cursor-pointer hover:text-blue-500" onClick={() => setDisplay(!display)}>
        Profile Image <i className={`ri-arrow-${display ? "up" : "down"}-s-line align-sub`}></i>
      </h2>
      {display && (
        <>
          <img
            src={account.photoURL || defaultPic}
            alt="user"
            width="80"
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
        </>
      )}
    </section>
  );
}
