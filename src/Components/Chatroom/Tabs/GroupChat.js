import { useContext, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/all";
import { firestore } from "../../../utils/firebase";
import { UserContext } from "../../../utils/Contexts";
function GroupChat() {
    const { userlocal } = useContext(UserContext);
    const [groupsData, setGroupsdata] = useState([]);
    useEffect(() => {
        if (userlocal.groups) {
            try {
                var unsub = firestore
                    .collection("groups-register")
                    .where("group_id", "in", userlocal.groups)
                    .onSnapshot(async (collection) => {
                        var list = [];
                        collection.forEach((data) => {
                            list.push(data.data());
                        });
                        setGroupsdata(list);
                    });
            } catch (err) {
                console.log(err);
            }
        }
        return unsub;
    }, [userlocal.groups]);
    return (
        <div className="groups">
            {userlocal && (
                <>
                    <h2 className="groups-header">
                        Chat Rooms <span>{userlocal.groups.length}</span>
                    </h2>
                    {groupsData.length !== 0 ? (
                        <div>
                            {groupsData.map((group) => {
                                return <GroupComponent group={group} key={group.group_id} />;
                            })}
                        </div>
                    ) : (
                        <h2 className="no_groups">No Groups</h2>
                    )}
                </>
            )}
        </div>
    );
}

export default GroupChat;

function GroupComponent({ group }) {
    return (
        <div className="group">
            <div className="group_profilePic">
                {group.profilePic ? <img src={group.profilePic} /> : <FaUserFriends size="2em" />}
            </div>
            <h3 className="group_name">{group.group_name}</h3>
        </div>
    );
}
