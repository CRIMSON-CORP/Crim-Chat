import { useContext } from "react";
import { BiUserPlus } from "react-icons/bi";
import { UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";
function UsersList({ users, selected, setSelected }) {
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const usersRefined = users.map((user) => user.data()).filter((user) => user.uid != uid);
    const usersJSX = usersRefined.map((user, index) => {
        return (
            <li
                className="user hover mb-20"
                key={index}
                onClick={() => {
                    if (selected.includes(user.uid)) {
                        setSelected(selected.filter((id) => id !== user.uid));
                    } else {
                        setSelected([...selected, user.uid]);
                    }
                }}
            >
                <div className="profilepic">
                    <div className="user-online-status">
                        <span className={`online-status ${user.onlineStatus}`}></span>
                    </div>
                    <ProfilePic img={user.profilePic} d_n={user.displayName} />
                </div>
                <div style={{ overflow: "hidden" }} className="user">
                    <h5 style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                        {user.displayName}
                    </h5>
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                        {user.email}
                    </span>
                </div>
                <div className={`add_user ${selected.includes(user.uid) ? "added" : ""}`}>
                    <BiUserPlus title="Add this User to this group" />
                </div>
            </li>
        );
    });
    return <ul className="users_list scroll">{usersJSX}</ul>;
}

export default UsersList;
