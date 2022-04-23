export default function Header({
  user,
  openMenu,
  setOpenMenu,
  children,
  chatSelection,
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
            className={`menu-toggle 
          ${openMenu ? "ri-close-line" : "ri-menu-5-line"} ${
              !user && "hidden"
            }`}
            onClick={() => setOpenMenu(!openMenu)}
          ></i>
        </div>
      </div>
      {user && (<div className="room-name-heading">{chatSelection.name}</div>)}
    </header>
  );
}
