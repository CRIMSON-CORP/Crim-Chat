import { useContext, useEffect, useState } from "react";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import { BiUserMinus } from "react-icons/bi";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { ProfilePic } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";

function GroupInfoModal() {
    const { selectedChat } = useContext(SelectedChatContext);
    const ref = firestore.collection(collections.groups_register).doc(selectedChat);
    const [groupInfo, loading] = useDocumentData(ref, { idField: "id" });

    return (
        <div>
            {!loading && (
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
    const ref = firestore.collection(collections.users).doc(member);
    const [mem, loading] = useDocumentDataOnce(ref, { idField: "uid" });
    const [adminState, setAdmin] = useState(null);
    const {
        userlocal: { uid, displayName },
    } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
    useEffect(() => {
        return () => {
            setAdmin(null);
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            setAdmin(uid === admin && mem.uid !== admin);
        }
    }, [!loading]);

    return (
        <>
            {!loading && (
                <li className="user hover  mb-20" key={member}>
                    <div className="profilepic">
                        <div className="user-online-status">
                            <span className={`online-status ${mem.onlineStatus}`}></span>
                        </div>
                        <ProfilePic img={mem.profilePic} d_n={mem.displayName} />
                    </div>
                    <div className="user trim">
                        <div className="user_name">
                            <h5 className="trim-text">{mem.displayName} </h5>
                            {admin == mem.uid && <span className="admin_state">(Admin)</span>}
                        </div>
                        <span className="trim-text">{mem.email}</span>
                    </div>
                    {adminState && (
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
