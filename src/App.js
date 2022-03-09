import "./index.css";
import { auth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="main-container">
      <nav className="header">
        <h1 className="logo">
          <i className="ri-cloud-fill"></i> Cloud Chat
        </h1>
        <SignOut user={user} />
      </nav>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
