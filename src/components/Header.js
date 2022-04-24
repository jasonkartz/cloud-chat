export default function Header({
  user,
  openMenu,
  setOpenMenu,
  children,
  chatSelection,
  setDarkMode,
  darkMode,
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
            className={`self-center text-2xl text-blue-50 hover:cursor-pointer hover:text-yellow-200 ri-${
              darkMode ? "moon" : "sun"
            }-line`}
            onClick={() => setDarkMode(!darkMode)}
          ></i>
          <i
            className={`menu-toggle 
          ${openMenu ? "ri-close-line" : "ri-menu-5-line"} ${
              !user && "hidden"
            }`}
            onClick={() => setOpenMenu(!openMenu)}
          ></i>
        </div>
      </div>
      {user && (
        <div className="room-name-heading">
          <span>{chatSelection.name}</span>
        </div>
      )}
    </header>
  );
}
