import { useContext, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/all";
import { firestore } from "../../../utils/firebase";
import { UserContext } from "../../../utils/Contexts";
function GroupChat() {
    const {
        user: { groups },
    } = useContext(UserContext);
    const [groupsData, setGroupsdata] = useState([]);
    useEffect(() => {
        if (groups.length) {
            try {
                groups.forEach((group) => {
                    firestore
                        .collection("groups-register")
                        .doc(`${group}`)
                        .get()
                        .then((gr) => {
                            setGroupsdata((prev) => {
                                return [...prev, gr.data()];
                            });
                        });
                });
            } catch (err) {
                console.log(err);
            }
        }
    }, [groups.length]);
    return (
        <div className="groups">
            <h2 className="groups-header">
                Chat Rooms <span>{groups.length}</span>
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
