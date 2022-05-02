import "./index.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleAuth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import Loading from "./components/loading-error-display/Loading";
import Error from "./components/loading-error-display/Error";
import Main from "./components/Main";
import SignIn from "./components/SignIn";

function App() {
  /* user auth state - displays signin if auth state is false*/
  const [user, userLoading, userError] = useAuthState(auth);

  /* signin with Google */
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuth).then(async () => {
      const { uid, displayName, email, photoURL } = auth.currentUser;
      const accountRef = doc(db, "accounts", auth.currentUser.uid);
      const docSnap = await getDoc(accountRef);

      try {
        if (docSnap.exists()) {
          updateDoc(accountRef, {
            lastLogin: serverTimestamp(),
          });
        } else {
          setDoc(accountRef, {
            uid: uid,
            name: displayName,
            userName: "",
            email: email,
            photoURL: photoURL || cloudImg,
            lastLogin: serverTimestamp(),
            followers: [],
            following: [],
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  /* sign in with email and password */

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signinMessage, setSigninMessage] = useState("");

  const signin = async () => {
    const { email, password } = signInData;

    setSigninMessage("Verifying...");
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          setSigninMessage("Signing in...");
          const accountRef = doc(db, "accounts", auth.currentUser.uid);
          updateDoc(accountRef, {
            lastLogin: serverTimestamp(),
          });
          setSigninMessage("");
          setSignInData({
            email: "",
            password: "",
          });
        }
      })
      .catch((error) => {
        setSigninMessage(error.code + " " + error.message);
        setTimeout(() => setSigninMessage(""), 5000);
      });
  };

  /* registration */

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordCheck: "",
  });

  const [registerMessage, setRegisterMessage] = useState("");

  const registerUser = async () => {
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
                  photoURL: cloudImg,
                  lastLogin: serverTimestamp(),
                  following: [],
                  followers: [],
                });
                setRegisterData({
                  name: "",
                  email: "",
                  username: "",
                  password: "",
                  passwordCheck: "",
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

  /* theme */

  const [darkMode, setDarkMode] = useState(false);
  const [systemTheme, setSystemTheme] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      document.body.classList.remove('bg-blue-200')
      document.body.classList.add('bg-slate-800')
    } else {
      document.body.classList.remove('bg-slate-800')
      document.body.classList.add('bg-blue-200')
      setDarkMode(false);
    }

    if (localStorage.systemTheme) {
      setSystemTheme(true);
    } else {
      setSystemTheme(false);
    }
  }, []);

  const cloudImg =
    "https://firebasestorage.googleapis.com/v0/b/chat-tut-d42b0.appspot.com/o/defaultImage%2Fcloud-fill.png?alt=media&token=4b7dbe8f-725f-4a8e-a2af-eed08b439550";

  if (userLoading) {
    return <Loading />;
  } else if (userError) {
    return <Error error={userError} content={"user data"} />;
  } else {
    return (
      <div className={`${darkMode && "dark"}`}>
        {user && (
          <Main
            user={user}
            userLoading={userLoading}
            userError={userError}
            cloudImg={cloudImg}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
        )}
        {user === null && (
          <SignIn
            signInWithGoogle={signInWithGoogle}
            setRegisterData={setRegisterData}
            registerData={registerData}
            registerMessage={registerMessage}
            setRegisterMessage={setRegisterMessage}
            registerUser={registerUser}
            signin={signin}
            signInData={signInData}
            setSignInData={setSignInData}
            signinMessage={signinMessage}
            setSigninMessage={setSigninMessage}
          />
        )}
      </div>
    );
  }
}

export default App;
