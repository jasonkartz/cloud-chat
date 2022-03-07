import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../backend/firebase-config";

export default function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };
  return (
    <button
      className="px-2 py-1 font-bold text-blue-100 bg-blue-500 rounded drop-shadow hover:text-blue-50 active:drop-shadow-sm"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </button>
  );
}
