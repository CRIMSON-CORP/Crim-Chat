import { useContext, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { DropList, OptionsDropDownItem, ProfilePic } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";
import { removeUser } from "../../../utils/firebaseUtils";

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
                                    admins={groupInfo.admins}
                                    creator={groupInfo.group_creator_id}
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

function GroupMember({ member, admins, creator }) {
    const ref = firestore.collection(collections.users).doc(member);
    const [mem, loading] = useDocumentData(ref, { idField: "uid" });
    const [adminState, setAdmin] = useState(null);
    const [options, setOptions] = useState(false);
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
            setAdmin(mem.uid != creator && mem.uid != uid && admins.includes(uid));
        }
        function close() {
            setOptions(false);
        }
        document.querySelector(".modal-content-custom").addEventListener("click", close);
        return document.addEventListener("click", close);
    }, [!loading, creator]);

    return (
        <>
            {!loading && mem && (
                <li
                    className="user hover  mb-20"
                    key={member}
                    id="groupInfoUser"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="profilepic">
                        <div className="user-online-status">
                            <span className={`online-status ${mem.onlineStatus}`}></span>
                        </div>
                        <ProfilePic img={mem.profilePic} d_n={mem.displayName} />
                    </div>
                    <div className="user trim">
                        <div className="user_name">
                            <h5 className="trim-text">
                                {mem.uid === uid ? "You" : mem.displayName}{" "}
                            </h5>
                            {admins.includes(mem.uid) && (
                                <span
                                    className={`admin_state ${mem.uid == creator ? "Super" : ""}`}
                                >
                                    {console.log(mem.uid == creator)}
                                    (Admin)
                                </span>
                            )}
                        </div>
                        <span className="trim-text">{mem.email}</span>
                    </div>
                    {adminState && (
                        <DropList
                            open={options}
                            setter={setOptions}
                            closeComp={<FaEllipsisV style={{ width: 20, height: 20 }} />}
                        >
                            {admins.includes(mem.uid) ? (
                                <OptionsDropDownItem
                                    onClickExe={async () => {
                                        const answer = confirm(
                                            "Are you sure you want to remove this User from Admin?"
                                        );
                                        if (answer) {
                                            try {
                                                await firestore
                                                    .collection(collections.groups_register)
                                                    .doc(selectedChat)
                                                    .update({
                                                        admins: firebase.firestore.FieldValue.arrayRemove(
                                                            mem.uid
                                                        ),
                                                    });
                                                toast.success(
                                                    `You made removed ${mem.displayName} from Admin!`
                                                );
                                            } catch (err) {
                                                console.log(err);
                                                toast.error("An Error occurded!");
                                            }
                                        }
                                    }}
                                >
                                    {"Remove from Admin"}
                                </OptionsDropDownItem>
                            ) : (
                                <OptionsDropDownItem
                                    onClickExe={async () => {
                                        const answer = confirm(
                                            "Are you sure you want to make this User an Admin?"
                                        );
                                        if (answer) {
                                            try {
                                                await firestore
                                                    .collection(collections.groups_register)
                                                    .doc(selectedChat)
                                                    .update({
                                                        admins: firebase.firestore.FieldValue.arrayUnion(
                                                            mem.uid
                                                        ),
                                                    });
                                                toast.success(
                                                    `You made ${mem.displayName} an Admin!`
                                                );
                                            } catch (err) {
                                                console.log(err);
                                                toast.error("An Error occurded!");
                                            }
                                        }
                                    }}
                                >
                                    {"Make Admin"}
                                </OptionsDropDownItem>
                            )}
                            {uid == creator && (
                                <OptionsDropDownItem
                                    onClickExe={async () => {
                                        const answer = confirm(
                                            "Are you sure you want to make this User a Super Admin? there can be only one Super Admin at a time"
                                        );
                                        if (answer) {
                                            try {
                                                await firestore
                                                    .collection(collections.groups_register)
                                                    .doc(selectedChat)
                                                    .update({
                                                        group_creator_id: mem.uid,
                                                        admins: firebase.firestore.FieldValue.arrayUnion(
                                                            mem.uid
                                                        ),
                                                    });
                                                toast.success(
                                                    `You made ${mem.displayName} a Super Admin!`
                                                );
                                            } catch (err) {
                                                console.log(err);
                                                toast.error("An Error occurded!");
                                            }
                                        }
                                    }}
                                >
                                    {"Make Super Admin"}
                                </OptionsDropDownItem>
                            )}
                            <OptionsDropDownItem
                                onClickExe={async () => {
                                    const answer = confirm(
                                        "Are you sure you want to remove this user?"
                                    );
                                    if (answer) {
                                        await removeUser(mem, uid, displayName, selectedChat);
                                        if (admins.includes(mem.uid)) {
                                            firestore
                                                .collection(collections.groups_register)
                                                .doc(selectedChat)
                                                .update({
                                                    admins: firebase.firestore.FieldValue.arrayRemove(
                                                        mem.uid
                                                    ),
                                                });
                                        }
                                        toast.success("You removed " + mem.displayName);
                                    }
                                }}
                            >
                                Remove User
                            </OptionsDropDownItem>
                        </DropList>
                    )}
                </li>
            )}
        </>
    );
}
