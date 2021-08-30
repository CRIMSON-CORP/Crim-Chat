import { useContext, useEffect, useState } from "react";
import {
    BiUserPlus,
    FaEllipsisH,
    FaSignOutAlt,
    FaUserFriends,
    MdAdd,
    MdDehaze,
    MdEdit,
} from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { LoaderContext, MobileNav, SelectedChatContext, UserContext } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { BorderedInput, Loader, Modal, ProfilePic, useModal } from "../../utils/CustomComponents";
import firebase, { firestore } from "../../utils/firebase";
import { ImageTypes } from "../../utils/utils";
import { v4 } from "uuid";
function Options() {
    const [optionsToggle, setOptionsToggle] = useState(false);
    const { setMobileNav } = useContext(MobileNav);
    const [createGroupModal, setCreateGroupModal] = useModal();
    return (
        <div className="optionsIcon">
            <MdDehaze
                className="ham"
                onClick={() => {
                    setMobileNav(true);
                }}
            />
            <div className="options_wrapper">
                <OnOutsiceClick
                    onOutsideClick={() => {
                        setOptionsToggle(false);
                    }}
                >
                    <FaEllipsisH
                        onClick={() => {
                            setOptionsToggle(!optionsToggle);
                        }}
                    />
                    <CSSTransition in={optionsToggle} classNames="fade" unmountOnExit timeout={400}>
                        <OptionsDropDown>
                            <OptionsDropDownItem
                                sufIcon={<MdAdd />}
                                onClickExe={() => {
                                    setCreateGroupModal(true);
                                    setOptionsToggle(false);
                                }}
                            >
                                Create Group
                            </OptionsDropDownItem>
                            <OptionsDropDownItem
                                sufIcon={<FaSignOutAlt />}
                                onClickExe={() => {
                                    signOut();
                                    setOptionsToggle(false);
                                }}
                            >
                                Sign out
                            </OptionsDropDownItem>
                        </OptionsDropDown>
                    </CSSTransition>
                </OnOutsiceClick>
            </div>
            <Modal
                header="Create a new Group"
                state={createGroupModal}
                setmodal={setCreateGroupModal}
                classTag="create-group"
            >
                <CreateGroupModalUI setmodal={setCreateGroupModal} />
            </Modal>
        </div>
    );
}

export default Options;

function OptionsDropDown({ children }) {
    return (
        <div className="options_dropdown">
            <ul>{children}</ul>
        </div>
    );
}

function OptionsDropDownItem({ children, sufIcon, onClickExe }) {
    return (
        <li className="dropDown_item" onClick={onClickExe}>
            {children} <div className="sufIcon">{sufIcon}</div>
        </li>
    );
}

function CreateGroupModalUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: "",
        name: "",
        descript: "",
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [setImageLoader, setSetImageLoader] = useState(false);

    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);

    const { setSelectedChat } = useContext(SelectedChatContext);
    async function setImage(e) {
        const image = e.target.files[0];
        setSetImageLoader(true);
        if (!ImageTypes.includes(image.type)) return;
        try {
            const ref = firebase.storage().ref("groups_profile_pic");
            await ref.put(image);
            const url = await ref.getDownloadURL();
            setGroupDetails((prev) => {
                return { ...prev, profile_icon: url };
            });
        } catch (err) {
            console.log(err);
        } finally {
            setSetImageLoader(false);
        }
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const id = v4();
            const notifid = v4();
            // Adds new group to the register
            await firestore
                .collection("groups-register")
                .doc(id)
                .set({
                    group_createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    group_creator: displayName,
                    group_description: groupDetails.descript,
                    group_id: id,
                    group_name: groupDetails.name,
                    group_profilePic: groupDetails.profile_icon,
                    group_members: [uid],
                });
            // Adds new group to user's list of groups
            await firestore
                .collection("users")
                .doc(uid)
                .update({
                    groups: firebase.firestore.FieldValue.arrayUnion(id),
                });
            // Send Bubble that user has created the group
            await firestore.collection("groups-register").doc(id).collection("messages").add({
                type: "bubble",
                tag: "group_created",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid: uid,
            });
            if (selectedUsers.length !== 0) {
                selectedUsers.forEach(async (user) => {
                    // Send notifications to added users
                    console.log(user);
                    await firestore
                        .collection("users")
                        .doc(user)
                        .collection("notif")
                        .doc(notifid)
                        .set({
                            notif_id: v4(),
                            sender: displayName,
                            type: "invite",
                            group_id: id,
                            sender_id: uid,
                        });
                    // Adds Bubble for each invited user
                    await firestore
                        .collection("groups-register")
                        .doc(id)
                        .collection("messages")
                        .add({
                            type: "bubble",
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            uid: uid,
                            tag: "invite_sent",
                            invitee_id: user,
                        });
                });
            }
            setSelectedChat(id);
            setmodal(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="form">
                <form onSubmit={submit}>
                    <div className="form_grid">
                        <div className="group_details">
                            <div className="profile_icon">
                                <h4 style={{ marginBottom: 20 }}>Group Profile Icon</h4>
                                <input
                                    type="file"
                                    name="group-profile-icon"
                                    accept="image/png, image/jpeg,image/jpg, image/JPEG, image/webpg"
                                    id="profile-icon"
                                    onChange={setImage}
                                />
                                <label htmlFor="profile-icon" className="profile_icon">
                                    <div className="cover">
                                        <CSSTransition
                                            in={groupDetails.profile_icon != ""}
                                            unmountOnExit
                                            timeout={400}
                                            classNames="profile_icon_switch_img"
                                        >
                                            <img
                                                src={groupDetails.profile_icon}
                                                alt="profile icon"
                                            />
                                        </CSSTransition>
                                        <CSSTransition
                                            in={groupDetails.profile_icon == ""}
                                            unmountOnExit
                                            timeout={400}
                                            classNames="profile_icon_switch_svg"
                                        >
                                            <span className="profile_icon_placeholder">
                                                <FaUserFriends size={40} />
                                            </span>
                                        </CSSTransition>
                                        {setImageLoader && <Loader />}
                                    </div>
                                    <span className="edit">
                                        <MdEdit />
                                    </span>
                                </label>
                            </div>
                            <div className="group_name">
                                <BorderedInput
                                    name="group_name"
                                    header="Group name"
                                    onChange={(e) => {
                                        setGroupDetails((prev) => {
                                            return { ...prev, name: e.target.value };
                                        });
                                    }}
                                    value={groupDetails.name}
                                    label="name"
                                    req={true}
                                />
                            </div>
                            <div className="group_descript">
                                <BorderedInput
                                    header="Group Description"
                                    name="group_description"
                                    onChange={(e) => {
                                        setGroupDetails((prev) => {
                                            return { ...prev, descript: e.target.value };
                                        });
                                    }}
                                    label="description"
                                    value={groupDetails.descript}
                                />
                            </div>
                        </div>
                        <div className="add_users">
                            <InviteUsers selected={selectedUsers} setSelected={setSelectedUsers} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-fill">
                        Create Group
                    </button>
                </form>
            </div>
        </>
    );
}

function InviteUsers({ selected, setSelected }) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        firestore
            .collection("users")
            .limit(10)
            .get()
            .then((usersList) => {
                setUsers(usersList.docs);
            });
    }, []);
    async function search(e) {
        const text = e.target.value.trim();
        const end = text.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
        try {
            const data = await firestore
                .collection("users")
                .where("displayName", ">=", text)
                .where("displayName", "<", end)
                .get();
            setUsers(data.docs);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <BorderedInput
                header="Invite Users"
                label="Search for Friends..."
                name="search_for_friends"
                onChange={search}
                req={false}
            />
            <h6 style={{ marginTop: 20 }}>{selected.length} Users Invited</h6>
            <UsersList users={users} selected={selected} setSelected={setSelected} />
        </div>
    );
}

function UsersList({ users, selected, setSelected }) {
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const usersRefined = users.map((user) => user.data()).filter((user) => user.uid != uid);
    const usersJSX = usersRefined.map((user) => {
        return (
            <li
                className="user hover mb-20"
                key={user.uid}
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
                <div className="user">
                    <h5> {user.displayName}</h5>
                    <span>{user.email}</span>
                </div>
                <div className={`add_user ${selected.includes(user.uid) ? "added" : ""}`}>
                    <BiUserPlus title="Add this User to this group" />
                </div>
            </li>
        );
    });
    return <ul className="users_list">{usersJSX}</ul>;
}
