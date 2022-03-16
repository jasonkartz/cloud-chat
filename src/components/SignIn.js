import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { auth, provider, db } from "../backend/firebase-config";
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


  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
  }
  return (
    <>
      <section className="bg-blue-300"></section>
      <button
        className="signin-btn"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </>
  );
}

/*
const createAccount = async () => {
    const { uid, displayName, email, photoURL } = auth.currentUser;
    const accountRef = doc(db, "accounts", uid)
    await setDoc(accountRef, {
      uid: uid,
      name:"",
      displayName: displayName,
      email: email,
      photoURL: photoURL,
    })
  }
*/