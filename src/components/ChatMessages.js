import ChatMessage from "./ChatMessage";
import { useRef, useEffect } from "react";

export default function ChatMessages(props) {
    const dummy = useRef();

  useEffect(
    () => dummy.current.scrollIntoView({ behavior: "smooth" }),
    [props.messages]
  );
  return (
    <>
      <main className="main-box">
        {props.messages.map((message, index) => {
          return <ChatMessage key={index} message={message} />;
        })}
        <div ref={dummy}></div>
      </main>
      
    </>
  );
}
