import "./index.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref } from "firebase/storage";
import { auth, db, storage } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useState } from "react";
import Loading from "./components/Loading";
import Error from "./components/Error";
import Main from "./components/Main";
import SignIn from "./components/SignIn";

function App() {
  /* user auth state - displays signin if auth state is false*/
  const [user, userLoading, userError] = useAuthState(auth);

  const cloudImg =
    "https://firebasestorage.googleapis.com/v0/b/chat-tut-d42b0.appspot.com/o/defaultImage%2Fcloud-fill.png?alt=media&token=4b7dbe8f-725f-4a8e-a2af-eed08b439550";

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

  if (userLoading) {
    return <Loading />;
  } else if (userError) {
    return <Error error={userError} content={"user data"} />;
  } else if (user === null) {
    return (
      <SignIn
        setRegisterData={setRegisterData}
        registerData={registerData}
        registerMessage={registerMessage}
        setRegisterMessage={setRegisterMessage}
        registerUser={registerUser}
      />
    );
  } else {
    return (
      <Main
        user={user}
        userLoading={userLoading}
        userError={userError}
        cloudImg={cloudImg}
      />
    );
  }
}

export default App;
