import { useContext, useEffect } from "react";
import { UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";
function User() {
    const { userlocal, setUserLocal } = useContext(UserContext);

    useEffect(() => {
        if (userlocal.onlineStatus) {
            setUserLocal((prev) => {
                console.log("navigator", navigator.onLine);
                return { ...prev, onlineStatus: navigator.online ? "Online" : "Offline" };
            });
        }
    }, [navigator.onLine]);

    useEffect(() => {
        if (userlocal.onlineStatus) {
            var online = () => {
                console.log("Online");
                setUserLocal((prev) => {
                    return { ...prev, onlineStatus: "Online" };
                });
            };
            var offline = () => {
                console.log("Offline");
                setUserLocal((prev) => {
                    return { ...prev, onlineStatus: "Offline" };
                });
            };
            window.addEventListener("online", online);
            window.addEventListener("offline", offline);
        }

        return () => {
            window.removeEventListener("online", online);
            window.removeEventListener("offline", offline);
        };
    }, [navigator.onLine, userlocal.onlineStatus]);

    // useEffect(() => {
    //     console.log(userlocal.onlineStatus);
    // }, [userlocal.onlineStatus]);
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
