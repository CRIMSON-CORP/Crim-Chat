import { useContext, useEffect } from "react";
import { UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";
import { UpdateUserOnlineStatus } from "../../../utils/firebaseUtils";

function User() {
    const { userlocal, setUserLocal } = useContext(UserContext);

    useEffect(() => {
        setUserLocal((prev) => {
            return { ...prev, onlineStatus: navigator.onLine ? "Online" : "Offline" };
        });

        const online = () => {
            setUserLocal((prev) => {
                return { ...prev, onlineStatus: "Online" };
            });
        };
        const offline = () => {
            setUserLocal((prev) => {
                return { ...prev, onlineStatus: "Offline" };
            });
        };
        window.addEventListener("online", online);
        window.addEventListener("offline", offline);

        return () => {
            window.removeEventListener("online", online);
            window.removeEventListener("offline", offline);
        };
    }, []);
    return (
        <div>
            {userlocal && (
                <div className="user-details">
                    <ProfilePic img={userlocal.profilePic} d_n={userlocal.displayName} />
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
