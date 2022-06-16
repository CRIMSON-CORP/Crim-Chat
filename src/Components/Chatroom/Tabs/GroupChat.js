import { useContext, useEffect, useRef } from "react";
import { FaUserFriends } from "react-icons/all";
import { firestore } from "../../../utils/firebase";
import { MobileNav, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import Isotope from "isotope-layout";
import { collections } from "../../../utils/FirebaseRefs";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BiImage } from "react-icons/bi";
function GroupChat() {
    const { userlocal } = useContext(UserContext);
    const groups_list = useRef();
    const ref = firestore.collection(collections.groups_register).orderBy("updatedAt", "desc");
    const [groupsData = []] = useCollectionData(ref, { idField: "group_id" });
    function trim(data = []) {
        let filt = data.filter((db) => userlocal.groups.includes(db.group_id));
        return filt;
    }
    return (
        <div className="groups">
            {userlocal && (
                <>
                    <h2 className="groups-header">
                        Group Chats <span>{userlocal.groups.length}</span>
                    </h2>
                    <div className="group_list scroll" ref={groups_list}>
                        {groupsData.length !== 0 ? (
                            <div>
                                {trim(groupsData).map((group) => {
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
    const { userlocal } = useContext(UserContext);

    useEffect(() => {
        let isotope = new Isotope(".group_list", {
            itemSelector: ".group_list .group",
        });
        group.group_id === selectedChat && isotope.reloadItems();
    }, [group.updatedAt]);
    return (
        <div
            className={`group hover ${group.group_id == selectedChat && "selected"}`}
            data-filter="*"
            onClick={() => {
                setSelectedChat(group.group_id);
                setMobileNav(false);
                localStorage.setItem("crimchat_current_group", group.group_id);
            }}
        >
            <div className="group_profilePic">
                {group.group_profilePic ? (
                    <img
                        src={group.group_profilePic}
                        al="group_profile_pic"
                        width={45}
                        height={45}
                    />
                ) : (
                    <FaUserFriends size="2em" />
                )}
            </div>
            <div className="group_text trim">
                <h3 className="group_name trim-text">{group.group_name}</h3>
                {(group.latestText || group.hasImage) && (
                    <span className="trim-text group_update">
                        {group.latestText_sender_uid == userlocal.uid ? (
                            <>
                                <div>You: {group.latestText} </div>
                                {group.hasImage && (
                                    <span>
                                        <BiImage size={10} />
                                        <span>: Photo</span>
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                <div>
                                    {group.latestText_sender} : {group.latestText}{" "}
                                </div>
                                <span>
                                    {group.hasImage && (
                                        <span>
                                            <BiImage size={10} />
                                            <span>: Photo</span>
                                        </span>
                                    )}
                                </span>
                            </>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}
