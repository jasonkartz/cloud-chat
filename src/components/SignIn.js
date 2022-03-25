import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
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

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordCheck: "",
  });

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  console.log(registerEmail + " " + registerPassword);

  const [registerMessage, setRegisterMessage] = useState("");

  const [SignInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

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

  const register = async () => {
    if (registerPassword === registerData.passwordCheck) {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      ).then((userCredential) => {
        if (userCredential.user) {
          const { uid } = auth.currentUser;
          const accountRef = doc(db, "accounts", auth.currentUser.uid);
          setDoc(accountRef, {
            uid: uid,
            name: registerData.name,
            userName: registerData.username,
            email: registerEmail,
            photoURL: "",
            lastLogin: serverTimestamp(),
          });
        }
      }).catch(error => {
        setRegisterMessage(error.code + " " + error.message)
        setTimeout(() => setRegisterMessage(""), 5000);
      })
    } else {
      setRegisterMessage("Passwords did not match! Try again.");
      setRegisterData({
        ...registerData,
        password: "",
        passwordCheck: "",
      });
      setTimeout(() => setRegisterMessage(""), 5000);
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
            <button className="btn" onClick={() => setSignUpView(true)}>
              Create an account
            </button>
          </div>
        </section>

        {/* Sign Up */}

        <section className={`signin-section ${!signUpView && "hidden"}`}>
          <h2 className="blue-heading">Sign Up</h2>

          <input
            type="text"
            placeholder="Your full name"
            className="form-input"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Your email"
            className="form-input"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Create a username"
            className="form-input"
            value={registerData.username}
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Create a password"
            className="form-input"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-enter password"
            className="form-input"
            value={registerData.passwordCheck}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                passwordCheck: e.target.value,
              })
            }
          />
          <div className="flex flex-col gap-2">
            <button className="btn" onClick={register}>
              Sign Up
            </button>
            <p>{registerMessage}</p>
            <button className="btn" onClick={() => setSignUpView(false)}>
              Have an account?
            </button>
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
