import defaultPic from "../../images/cloud-fill.png";
import Loading from "../loading-error-display/Loading";
import Error from "../loading-error-display/Error";

export default function FollowList({
  selectFollowList,
  accountsLoading,
  accountsError,
  accounts,
  selectedAccount,
  setAccountSelection,
  setOpenFollowList,
  setScreen,
}) {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="heading">
          {selectFollowList === "followers" ? "Following" : "Followers"}
        </h1>
      </div>
      <ul>
        {accountsLoading && <Loading />}

        {accountsError && <Error error={accountsError} content={"content"} />}

        {accounts &&
          accounts.map((account, index) => {
            return (
              account[selectFollowList].includes(selectedAccount.uid) && (
                <li
                  className="user-list-display"
                  key={index}
                  onClick={() => {
                    setAccountSelection(account.uid);
                    setOpenFollowList(false);
                    setScreen("profile");
                  }}
                >
                  <img
                    src={account.photoURL || defaultPic}
                    alt="user"
                    width="25"
                    className="self-center rounded"
                  />
                  <span className="flex flex-col">
                    <p>{account.userName || account.name} </p>
                    <p className="text-sm">
                      {account.userName && account.name}
                    </p>
                  </span>
                </li>
              )
            );
          })}
      </ul>
    </>
  );
}
