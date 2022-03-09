import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function SignOut({ user }) {
  return (
    user && (
      <>
        <p className="flex items-center gap-1 font-bold text-yellow-100 text-md">
          <i class="ri-user-3-fill text-sm"></i> {user.displayName}
        </p>
        <button className="signout-btn" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </>
    )
  );
}
