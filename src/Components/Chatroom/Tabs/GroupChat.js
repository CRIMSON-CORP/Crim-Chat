import { useContext, useEffect, useRef, useState } from "react";
import { FaUserFriends } from "react-icons/all";
import { firestore } from "../../../utils/firebase";
import { MobileNav, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import Isotope from "isotope-layout";
import { collections, feilds } from "../../../utils/FirebaseRefs";
function GroupChat() {
    const { userlocal } = useContext(UserContext);
    const [groupsData, setGroupsdata] = useState([]);
    const groups_list = useRef();

    useEffect(() => {
        if (userlocal.groups.length !== 0) {
            try {
                var unsub = firestore
                    .collection(collections.groups_register)
                    .orderBy("updatedAt", "desc")
                    .where(feilds.group_id, "in", [...userlocal.groups])
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
        } else {
            setGroupsdata([]);
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
                    <div className="group_list" ref={groups_list}>
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
                </>
            )}
        </div>
    );
}

export default GroupChat;

function GroupComponent({ group }) {
    const { selectedChat, setSelectedChat } = useContext(SelectedChatContext);
    const { setMobileNav } = useContext(MobileNav);

    useEffect(() => {
        let isotope = new Isotope(".groups", {
            itemSelector: ".groups .group",
        });
        group.group_id === selectedChat && isotope.reloadItems();
    }, [group.updatedAt]);
    return (
        <div
            className="group hover"
            data-filter="*"
            onClick={() => {
                setSelectedChat(group.group_id);
                setMobileNav(false);
            }}
        >
            <div className="group_profilePic">
                {group.group_profilePic !== null ? (
                    <img src={group.group_profilePic} />
                ) : (
                    <FaUserFriends size="2em" />
                )}
            </div>
            <div className="group_text">
                <h3 className="group_name">{group.group_name}</h3>
                <span>{group.latestText}</span>
            </div>
        </div>
    );
}
