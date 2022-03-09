import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider } from "../backend/firebase-config";
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

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

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
