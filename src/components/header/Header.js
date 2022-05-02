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
      <div className="flex items-center justify-between px-2 py-1">
        <h1 className="logo">
          <i className="text-3xl ri-cloud-fill"></i>
          <span className="self-center text-2xl">CloudChat</span>
        </h1>
        <div className="flex justify-end gap-4">
          {children}
          {!systemTheme && (
            <i
              className={`theme-toggle ri-${darkMode ? "moon" : "sun"}-line`}
              onClick={() => {
                if (darkMode === true) {
                  localStorage.theme = "light";
                  document.body.classList.remove("bg-slate-900", "lg:bg-slate-800");
                  document.body.classList.add("bg-blue-300", "lg:bg-blue-200");
                } else {
                  localStorage.theme = "dark";
                  document.body.classList.remove("bg-blue-300", "lg:bg-blue-200");
                  document.body.classList.add("bg-slate-900", "lg:bg-slate-800");
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
