import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider, db } from "../backend/firebase-config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function SignIn() {
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
    const docSnap = getDoc(accountRef)

    if (docSnap.exists) {
      setDoc(accountRef, {
        lastLogin: serverTimestamp(),
      });
    } else {
      setDoc(accountRef, {
        uid: uid,
        name: displayName,
        displayName: null,
        email: email,
        photoURL: photoURL,
        lastLogin: serverTimestamp(),
      });
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider).then(() => syncAccount());
  };
  return (
    <>
      <section className="bg-blue-300"></section>
      <button className="signin-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}
