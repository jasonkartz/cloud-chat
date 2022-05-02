export default function MessageForm({
  formValue,
  setFormValue,
  sendMessage,
  openMenu,
  setOpenMenu,
}) {
  return (
    <form onSubmit={sendMessage} className="message-form" onClick={() => openMenu && setOpenMenu(false)}>
      <input
        type="text"
        className="text-input message-input"
        placeholder="Say something nice"
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
      ></input>
      <button type="submit" className="message-btn" disabled={!formValue}>
        <i className="ri-send-plane-fill"></i>
      </button>
    </form>
  );
}
