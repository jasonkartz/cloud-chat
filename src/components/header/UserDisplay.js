import Loading from "../loading-error-display/Loading";
import Error from "../loading-error-display/Error";

export default function UserDisplay({
  user,
  setOpenMenu,
  setScreen,
  setAccountSelection,
  account,
  accountLoading,
  accountError,
  cloudImg,
}) {
  if (accountLoading) {
    return <Loading />;
  } else if (accountError) {
    return <Error error={accountError} content={"user info"} />;
  } else if (account) {
    return (
      <div
        className="user-display-container"
        onClick={() => {
          setAccountSelection(user.uid);
          setOpenMenu(true);
          setScreen("profile");
        }}
      >
        {!account.userName ? user.displayName : account.userName}
        {account.photoURL && (
          <img
            src={account.photoURL || cloudImg}
            alt="user"
            className="user-display-image"
            width="30"
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        className="user-display-container"
        onClick={() => {
          setAccountSelection(user.uid);
          setOpenMenu(true);
          setScreen("profile");
        }}
      >
        <i className="text-xl text-blue-100 hover:text-yellow-200 ri-user-line dark:text-blue-50"></i>
      </div>
    );
  }
}
