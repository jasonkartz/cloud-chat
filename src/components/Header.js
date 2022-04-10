export default function Header({
  user,
  openMenu,
  setOpenMenu,
  roomName,
  children,
}) {
  return (
    <header className={`header`}>
      <div className="flex justify-between px-2 py-1 items center">
        <h1 className="logo">
          <i className="ri-cloud-fill"></i>CloudChat
        </h1>
        <div className="flex justify-end gap-2">
          {children}
          <i
            className={`text-blue-100 transition text-3xl hover:cursor-pointer hover:text-yellow-100 
          ${openMenu ? "ri-close-line" : "ri-menu-5-line"} ${
              !user && "hidden"
            }`}
            onClick={() => setOpenMenu(!openMenu)}
          ></i>
        </div>
      </div>
      {user && (<div className="room-name-heading">{roomName}</div>)}
    </header>
  );
}
