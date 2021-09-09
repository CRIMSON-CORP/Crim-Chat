import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiUserMinus } from "react-icons/bi";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";

function GroupInfoModal() {
    const [groupInfo, setgroupInfo] = useState({
        group_profilePic: null,
        group_members: [],
    });
    const { selectedChat } = useContext(SelectedChatContext);
    useEffect(() => {
        if (selectedChat != undefined) {
            var unsub = firestore
                .collection(collections.groups_register)
                .doc(selectedChat)
                .onSnapshot((data) => {
                    setgroupInfo(data.data());
                });
        }
        return unsub;
    }, []);

    return (
        <div>
            {groupInfo && (
                <>
                    <ProfilePic tag="group" img={groupInfo.group_profilePic} />
                    <h4 className="mb-2">{groupInfo.group_name}</h4>
                    <p className="font-italic">{groupInfo.group_description}</p>
                    <h4 className="mt-3">Group Members</h4>
                    <ul className="users_list scroll">
                        {groupInfo.group_members.map((grp, index) => {
                            return (
                                <GroupMember
                                    member={grp}
                                    key={index}
                                    admin={groupInfo.group_creator_id}
                                />
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}

export default GroupInfoModal;

function GroupMember({ member, admin }) {
    const [mem, setMem] = useState(null);
    const {
        userlocal: { uid, displayName },
    } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
    useEffect(() => {
        firestore
            .collection(collections.users)
            .doc(member)
            .get()
            .then((data) => {
                setMem(data.data());
            });
    }, []);

    return (
        <>
            {mem && (
                <li className="user hover  mb-20" key={member}>
                    <div className="profilepic">
                        <div className="user-online-status">
                            <span className={`online-status ${mem.onlineStatus}`}></span>
                        </div>
                        <ProfilePic img={mem.profilePic} d_n={mem.displayName} />
                    </div>
                    <div className="user trim">
                        <h5 className="trim-text">{mem.displayName}</h5>
                        <span className="trim-text">{mem.email}</span>
                    </div>
                    {uid === admin && mem.uid !== admin && (
                        <div
                            className={`add_user red`}
                            onClick={async () => {
                                const answer = confirm(
                                    "Are you sure you want to remove this user?"
                                );
                                if (answer) {
                                    await firestore
                                        .collection(collections.users)
                                        .doc(mem.uid)
                                        .update({
                                            groups: firebase.firestore.FieldValue.arrayRemove(
                                                selectedChat
                                            ),
                                        });
                                    await firestore
                                        .collection(collections.groups_register)
                                        .doc(selectedChat)
                                        .update({
                                            group_members:
                                                firebase.firestore.FieldValue.arrayRemove(mem.uid),
                                        });
                                    await firestore
                                        .collection(collections.groups_register)
                                        .doc(selectedChat)
                                        .collection(collections.messages)
                                        .add({
                                            type: "bubble",
                                            createdAt:
                                                firebase.firestore.FieldValue.serverTimestamp(),
                                            admin_uid: uid,
                                            tag: "user_removed",
                                            removed_user: mem.displayName,
                                            admin: displayName,
                                        });
                                    toast.success("You removed " + mem.displayName);
                                }
                            }}
                        >
                            <BiUserMinus title="Remove this User from this group" />
                        </div>
                    )}
                </li>
            )}
        </>
    );
}
