import { useContext } from "react";
import { UserContext } from "../../../utils/Contexts";

function User() {
    const { user } = useContext(UserContext);
    return (
        <div className="user-details">
            <div className="profilePic">
                {user.profilePic ? (
                    <img src={user.profilePic} alt="profile" />
                ) : (
                    <div className="alt">{user.displayName[0]}</div>
                )}
            </div>
            <div className="user-display-name">{user.displayName}</div>
            <div className="user-email">{user.email}</div>
            <div className="user-online-status">
                {user.onlineStatus} <span className={`online-status ${user.onlineStatus}`}></span>
            </div>
        </div>
    );
}

export default User;
