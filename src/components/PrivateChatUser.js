import defaultPic from "../images/cloud-fill.png";
import { auth, db } from "../backend/firebase-config";
import { doc, getDoc, collection } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Loading from "./Loading";
import Error from "./Error";

export default function PrivateChatUser({ chat }) {
  const { chatID, chatPath, withUser } = chat;
  const accountRef = doc(db, "accounts", withUser);
  const [account, loading, error] = useDocumentData(accountRef);
  
  if (loading) {
      return <Loading />
  } else if (error) {
      return <Error error={error} content={"user"} />
  } else {
      return <>{account.name}</>
  }
}
