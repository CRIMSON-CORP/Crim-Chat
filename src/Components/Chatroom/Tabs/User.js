import { useContext } from "react";
import { UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";

function User() {
    const { userlocal } = useContext(UserContext);
    return (
        <div>
            {userlocal && (
                <div className="user-details">
                    <ProfilePic img={userlocal.profilePic} d_n={userlocal.displayName[0]} />
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
