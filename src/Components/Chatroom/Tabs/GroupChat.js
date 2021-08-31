import { useContext, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/all";
import { firestore } from "../../../utils/firebase";
import { MobileNav, SelectedChatContext, UserContext } from "../../../utils/Contexts";
function GroupChat() {
    const { userlocal } = useContext(UserContext);
    const [groupsData, setGroupsdata] = useState([]);
    useEffect(() => {
        if (userlocal.groups.length !== 0) {
            try {
                var unsub = firestore
                    .collection("groups-register")
                    .orderBy("updatedAt", "desc")
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
    const { setSelectedChat } = useContext(SelectedChatContext);
    const { setMobileNav } = useContext(MobileNav);
    return (
        <div
            className="group hover"
            onClick={() => {
                setSelectedChat(group.group_id);
                setMobileNav(false);
            }}
        >
            <div className="group_profilePic">
                {group.group_profilePic === null ? (
                    <img src={group.group_profilePic} />
                ) : (
                    <FaUserFriends size="2em" />
                )}
            </div>
            <h3 className="group_name">{group.group_name}</h3>
        </div>
    );
}
