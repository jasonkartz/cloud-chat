import { auth } from "../backend/firebase-config";
import { signOut } from "firebase/auth";

export default function SignOut({user}) {
  return user && (
    <button className="px-2 py-1 font-bold text-blue-100 bg-blue-500 rounded drop-shadow hover:text-blue-50 active:drop-shadow-sm"
    onClick={() => signOut(auth)}
    >
      Sign Out
    </button>
  );
}
