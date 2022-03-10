import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function SignOut({ user }) {
  return (
    user && (
      <>
        <button className="signout-btn" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </>
    )
  );
}
