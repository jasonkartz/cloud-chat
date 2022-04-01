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
      {props.messages.map((message, index) => {
        return <ChatMessage key={index} message={message} />;
      })}
      <div className="mt-20" ref={dummy}></div>
    </>
  );
}
