import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function SignOut({ user }) {
  return (
    user && (
      <>
        <button className="settings-btn" onClick={() => signOut(auth)}>
          <i className="align-bottom ri-logout-box-line"></i> Sign Out 
        </button>
      </>
    )
  );
}
