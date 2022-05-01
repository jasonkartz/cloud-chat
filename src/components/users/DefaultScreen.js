import defaultPic from "../../images/cloud-fill.png";

export default function DefaultScreen({
  setOpenFollowList,
  setSelectFollowList,
  selectedAccount,
  user,
  followCheck,
  unFollowUser,
  followUser,
  sendMessage,
  setScreen,
}) {
  return (
    <>
      <p className="font-bold">
        <span
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenFollowList(true);
            setSelectFollowList("following");
          }}
        >
          Followers{" "}
          {selectedAccount.followers ? selectedAccount.followers.length : "0"}
        </span>{" "}
        |{" "}
        <span
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenFollowList(true);
            setSelectFollowList("followers");
          }}
        >
          Following{" "}
          {selectedAccount.following ? selectedAccount.following.length : "0"}
        </span>
      </p>

      <img
        src={selectedAccount.photoURL || defaultPic}
        alt="user"
        className="profile-image size-one-hundred"
      />

      {selectedAccount.uid !== user.uid && (
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 btn"
            onClick={followCheck ? unFollowUser : followUser}
          >
            <i
              className={`ri-user-${followCheck ? "unfollow" : "follow"}-line text-2xl`}
            ></i>
          </button>
          <button
            className="flex items-center gap-1 btn"
            onClick={() => sendMessage()}
          >
            <i className={`ri-chat-2-line text-2xl`}></i>
            <span>Message</span>
          </button>
        </div>
      )}
      <p className="text-sm">
        Last Login:<br />
        {selectedAccount.lastLogin &&
          selectedAccount.lastLogin.toDate().toLocaleString()}
      </p>

      {selectedAccount.uid !== user.uid && (
        <p className="profile-back-btn" onClick={() => setScreen("users")}>
          <i className="text-lg font-bold ri-arrow-go-back-line"></i>
          <span>User List</span>
        </p>
      )}
    </>
  );
}