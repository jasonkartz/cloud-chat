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
        className="px-2 py-1 font-bold text-blue-100 bg-blue-500 rounded-b 
        drop-shadow hover:text-yellow-100 active:drop-shadow-sm"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </>
  );
}
