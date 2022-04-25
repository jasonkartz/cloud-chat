import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordCheck: "",
  });

  const [registerMessage, setRegisterMessage] = useState("");

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signinMessage, setSigninMessage] = useState("");

  const register = async () => {
    const { name, email, username, password, passwordCheck } = registerData;
    setRegisterMessage("Signing up...");
    if (password === passwordCheck) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          if (userCredential.user) {
            const { uid } = auth.currentUser;
            const accountRef = doc(db, "accounts", uid);
            await updateProfile(auth.currentUser, { displayName: name }).then(
              () => {
                setDoc(accountRef, {
                  uid: uid,
                  name: name,
                  userName: username,
                  email: email,
                  photoURL: "",
                  lastLogin: serverTimestamp(),
                  following: [],
                  followers: [],
                });
              }
            );
          }
        })
        .catch((error) => {
          setRegisterMessage(error.code + " " + error.message);
          setTimeout(() => setRegisterMessage(""), 5000);
        });
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

  const signin = async () => {
    const { email, password } = signInData;

    setSigninMessage("Signing in...");
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          const accountRef = doc(db, "accounts", auth.currentUser.uid);
          updateDoc(accountRef, {
            lastLogin: serverTimestamp(),
          });
        }
      })
      .catch((error) => {
        setSigninMessage(error.code + " " + error.message);
        setTimeout(() => setSigninMessage(""), 5000);
      });
  };

  const syncAccount = async () => {
    const { uid, displayName, email, photoURL } = auth.currentUser;
    const accountRef = doc(db, "accounts", auth.currentUser.uid);
    const docSnap = getDoc(accountRef);

    if (docSnap) {
      updateDoc(accountRef, {
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(accountRef, {
        uid: uid,
        name: displayName,
        userName: "",
        email: email,
        photoURL: photoURL,
        lastLogin: serverTimestamp(),
        followers: [],
        following: [],
      });
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuth).then(async () => await syncAccount());
  };
  return (
    <>
        {
          /* Sign In */
          !signUpView && (
            <>
              <section className={`signin-section`}>
                <h2 className="heading">Sign In</h2>

                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="text-input text-input-signin-width"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="text-input text-input-signin-width"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                />
                <div className="flex flex-col gap-2">
                  <button className="btn" onClick={signin}>
                    Sign in
                  </button>
                  <button className="btn" onClick={() => setSignUpView(true)}>
                    Create an account
                  </button>
                  <p>{signinMessage}</p>
                </div>
              </section>
            </>
          )
        }

        {
          /* Sign Up */
          signUpView && (
            <>
              <section className={`signin-section`}>
                <h2 className="heading">Sign Up</h2>

                <input
                  type="text"
                  placeholder="Your full name"
                  className="text-input text-input-signin-width"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="text-input text-input-signin-width"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Create a username"
                  className="text-input text-input-signin-width"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="text-input text-input-signin-width"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className="text-input text-input-signin-width"
                  value={registerData.passwordCheck}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      passwordCheck: e.target.value,
                    })
                  }
                />
                <div className="flex flex-col gap-1">
                  <button className="btn" onClick={register}>
                    Sign Up
                  </button>
                  <p>{registerMessage}</p>
                  <button className="btn" onClick={() => setSignUpView(false)}>
                    Have an account?
                  </button>
                </div>
              </section>
            </>
          )
        }

        <button className="self-center btn" onClick={signInWithGoogle}>
          <i className="sign-in-btn-google-icon ri-google-fill"></i>{" "}
          <span className="align-top">Sign in with Google</span>
        </button>
    </>
  );
}
