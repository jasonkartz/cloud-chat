export default function Header({
  user,
  openMenu,
  setOpenMenu,
  children,
  chatSelection,
  setDarkMode,
  darkMode,
  systemTheme,
}) {
  return (
    <header className={`header`}>
      <div className="flex justify-between px-2 py-1 items center">
        <h1 className="logo">
          <i className="ri-cloud-fill"></i>CloudChat
        </h1>
        <div className="flex justify-end gap-2">
          {children}
          {!systemTheme && (
            <i
              className={`theme-toggle ri-${
                darkMode ? "moon" : "sun"
              }-line`}
              onClick={() => {
                if (darkMode === true) {
                  localStorage.theme = "light";
                } else {
                  localStorage.theme = "dark";
                }
                setDarkMode(!darkMode);
              }}
            ></i>
          )}
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
