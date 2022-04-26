import "./index.css";
import { auth, db } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./components/Loading";
import Error from "./components/Error";
import Main from "./components/Main";
import SignIn from "./components/SignIn";

function App() {
  /* user auth state - displays signin if auth state is false*/
  const [user, userLoading, userError] = useAuthState(auth);

  if (userLoading) {
    return <Loading />;
  } else if (userError) {
    return <Error error={userError} content={"user data"} />;
  } else if (user === null) {
    return <SignIn />;
  } else {
    return <Main user={user} userLoading={userLoading} userError={userError} />;
  }
}

export default App;
