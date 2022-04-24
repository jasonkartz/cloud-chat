export default function MessageForm(props) {
  return (
    <form onSubmit={props.sendMessage} className="message-form">
      <input
        type="text"
        className="text-input message-input"
        placeholder="Say something nice"
        value={props.formValue}
        onChange={(e) => props.setFormValue(e.target.value)}
      ></input>
      <button type="submit" className="message-btn" disabled={!props.formValue}>
        <i className="ri-send-plane-fill"></i>
      </button>
    </form>
  );
}
