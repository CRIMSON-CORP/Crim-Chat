import { useContext } from "react";
import { UserContext } from "../../../utils/Contexts";

function User() {
    const { userlocal } = useContext(UserContext);
    return (
        <div>
            {userlocal && (
                <div className="user-details">
                    <div className="profilePic">
                        {userlocal.profilePic ? (
                            <img src={userlocal.profilePic} alt="profile" />
                        ) : (
                            <div className="alt">{userlocal.displayName[0]}</div>
                        )}
                    </div>
                    <div className="user-display-name">{userlocal.displayName}</div>
                    <div className="user-email">{userlocal.email}</div>
                    <div className="user-online-status">
                        {userlocal.onlineStatus}{" "}
                        <span className={`online-status ${userlocal.onlineStatus}`}></span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default User;
