import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleAuth, db } from "../backend/firebase-config";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

export default function SignIn() {
  const [signUpView, setSignUpView] = useState(false);

  const [register, setRegister] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [SignIn, setSignIn] = useState({
    email: "",
    username: "",
    password: "",
  });

  const syncAccount = () => {
    const { uid, displayName, email, photoURL } = auth.currentUser;
    const accountRef = doc(db, "accounts", auth.currentUser.uid);
    const docSnap = getDoc(accountRef);

    if (docSnap.exists) {
      updateDoc(accountRef, {
        lastLogin: serverTimestamp(),
      });
    } else {
      setDoc(accountRef, {
        uid: uid,
        name: displayName,
        userName: "",
        email: email,
        photoURL: photoURL,
        lastLogin: serverTimestamp(),
      });
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuth).then(() => syncAccount());
  };
  return (
    <>
      <main className="main-box-signin">
        {/* Sign In */}
        <section className={`signin-section ${signUpView && "hidden"}`}>
          <h2 className="blue-heading">Sign In</h2>

          <input
            type="text"
            placeholder="Enter Your Username"
            className="form-input"
          />
          <input
            type="text"
            placeholder="Enter Your Password"
            className="form-input"
          />
          <div className="flex flex-col gap-2">
            <button className="btn">Sign in</button>
            <button className="btn" onClick={() => setSignUpView(true)}>Create an account</button>
          </div>
        </section>

        {/* Sign Up */}

        <section className={`signin-section ${!signUpView && "hidden"}`}>
          <h2 className="blue-heading">Sign Up</h2>

          <input
            type="text"
            placeholder="Your full name"
            className="form-input"
          />
          <input
            type="email"
            placeholder="Your email"
            className="form-input"
          />
          <input
            type="text"
            placeholder="Create a username"
            className="form-input"
          />
          <input
            type="password"
            placeholder="Create a password"
            className="form-input"
          />
          <input
            type="password"
            placeholder="Re-enter password"
            className="form-input"
          />
          <div className="flex flex-col gap-2">
            <button className="btn">Sign Up</button>
            <button className="btn" onClick={() => setSignUpView(false)}>Have an account?</button>
          </div>
        </section>

        <button className="self-center signin-btn" onClick={signInWithGoogle}>
          <i className="p-1 text-blue-600 rounded ri-google-fill bg-slate-50"></i>{" "}
          <span className="align-top">Sign in with Google</span>
        </button>
      </main>
    </>
  );
}
