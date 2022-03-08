import "./index.css";
import { auth } from "./backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="container mx-auto rounded drop-shadow-xl sm:w-5/6 md:w-4/6 lg:w-3/6 h-[95vh] flex flex-col">
      <nav className="flex justify-between p-2 bg-blue-100 bg-opacity-25 rounded-t md:text-lg">
        <h1 className="flex gap-2 text-2xl italic font-black tracking-wide text-blue-100 md:text-3xl">
          <i className="ri-cloud-fill"></i> Cloud Chat
        </h1>
        <SignOut user={user} />
      </nav>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
