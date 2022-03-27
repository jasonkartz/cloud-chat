import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../backend/firebase-config";

export default function UserDisplay(props) {
  const accountRef = doc(db, "accounts", props.user.uid);
  const [account, loading, error] = useDocumentData(accountRef);

  if (loading) {
    return (
      <div className="animate-spin">
        <i className="ri-loader-5-line"></i>
      </div>
    );
  } else if (error) {
    return (
      <p className="text-red-800">
        <i className="ri-error-warning-line"></i> Error Loading Content
      </p>
    );
  } else {
    return (
      <p className="flex items-center gap-1 text-sm font-bold select-none text-blue-50">
        <i className="text-green-300 ri-user-3-fill animate-pulse"></i>{" "}
        {account.userName || account.name}
      </p>
    );
  }
}