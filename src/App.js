import "./index.css";
import { auth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

function App() {
  const [user] = useAuthState(auth);
  console.log(user);
  return (
    <div className="main-container">
      <nav className="header">
        <h1 className="logo">
          <i className="ri-cloud-fill"></i>CloudChat
        </h1>

        
        <SignOut user={user} />
      </nav>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
