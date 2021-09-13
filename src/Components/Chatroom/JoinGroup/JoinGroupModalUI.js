import { useContext, useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, ProfilePic } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { collections, feilds } from "../../../utils/FirebaseRefs";
import toast from "react-hot-toast";
import { Loader } from "../../../utils/CustomComponents";
function JoinGroupModalUI({ setmodal }) {
    const [groupsDb, setGroups] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const {
        userlocal: { groups },
    } = useContext(UserContext);
    function trim(data) {
        let dbArr = data.docs.map((doc) => doc.data());
        let filt = dbArr.filter((db) => !groups.includes(db.group_id));
        return filt;
    }
    const fetchGroups = async () => {
        setLoading(true);
        try {
            await firestore
                .collection(collections.groups_register)
                .where(feilds.group_security, "==", false)
                .get()
                .then((groupsList) => {
                    setGroups(trim(groupsList));
                });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGroups();
        return setGroups(null);
    }, []);
    async function search(text) {
        if (text == "") return fetchGroups();
        const end = text.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
        try {
            setLoading(true);
            await firestore
                .collection(collections.groups_register)
                .where(feilds.group_security, "==", false)
                .where(feilds.group_name, ">=", text)
                .where(feilds.group_name, "<", end)
                .get()
                .then((data) => {
                    setGroups(trim(data));
                });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        search(text);
    }, [text]);
    return (
        <div className="join-group-wrapper">
            <BorderedInput
                header="Search Groups"
                label="Search for Groups..."
                name="search_groups"
                onChange={(e) => {
                    setText(e.target.value);
                }}
                value={text}
            />
            <h4 className="mt-3">Suggested Groups</h4>
            <div className="list-loader">
                {groupsDb && !loading ? (
                    <GroupsList groupsDb={groupsDb} setmodal={setmodal} />
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
}

export default JoinGroupModalUI;
function GroupsList({ groupsDb, setmodal }) {
    const {
        userlocal: { uid, displayName },
    } = useContext(UserContext);
    const { setSelectedChat } = useContext(SelectedChatContext);
    const groupsJSX = groupsDb.map((group, index) => {
        return (
            <li
                className="user hover mb-20"
                key={index}
                onClick={async () => {
                    const answer = confirm("Are you sure you want to join this Group Chat?");

                    if (answer) {
                        await firestore
                            .collection(collections.users)
                            .doc(uid)
                            .update({
                                groups: firebase.firestore.FieldValue.arrayUnion(group.group_id),
                            });
                        await firestore
                            .collection(collections.groups_register)
                            .doc(group.group_id)
                            .update({
                                [feilds.group_members]:
                                    firebase.firestore.FieldValue.arrayUnion(uid),
                            });
                        await firestore
                            .collection(collections.groups_register)
                            .doc(group.group_id)
                            .collection(collections.messages)
                            .add({
                                type: "bubble",
                                tag: "user_joined",
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                user_that_joined_id: uid,
                                user_that_joined_name: displayName,
                            });
                        setSelectedChat(group.group_id);
                        toast.success("Group Chat Joined successfuly!");
                        setmodal(false);
                    }
                }}
            >
                <div className="profilepic">
                    <ProfilePic img={group.group_profilePic} tag="group" />
                </div>
                <div className="user">
                    <h5> {group.group_name}</h5>
                    <span>
                        {group.group_members.length == 0
                            ? "Nobody in this Group"
                            : group.group_members.length == 1
                            ? "1 member"
                            : `${group.group_members.length} members`}
                    </span>
                </div>
                <div className="add_user">
                    <BiUserPlus title="Join this group" />
                </div>
            </li>
        );
    });

    return (
        <ul className="users_list scroll">
            {groupsJSX.length !== 0 ? groupsJSX : <h4>No Suggestions</h4>}
        </ul>
    );
}
