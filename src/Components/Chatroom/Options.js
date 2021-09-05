import { useContext, useEffect, useRef, useState } from "react";
import {
    BiMoon,
    BiSun,
    FaEllipsisH,
    FaSignOutAlt,
    MdAdd,
    MdDehaze,
    MdEdit,
    MdNotifications,
} from "react-icons/all";
import { MobileNav, SelectedChatContext, UserContext } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import {
    DropList,
    Modal,
    NotifDropDownItem,
    OptionsDropDownItem,
    useModal,
} from "../../utils/CustomComponents";
import CreateGroupModalUI from "./CreateGroup/CreateGroupModalUI";
import JoinGroupModalUI from "./JoinGroup/JoinGroupModalUI";
import EditProfile from "./EditProfile/EditProfile";
import firebase, { firestore, timeStamp } from "../../utils/firebase";
import { collections, feilds } from "../../utils/FirebaseRefs";
import { CSSTransition } from "react-transition-group";
import toast from "react-hot-toast";

function Options() {
    const [optionsToggle, setOptionsToggle] = useState(false);
    const { setMobileNav } = useContext(MobileNav);
    const {
        userlocal: { mode, uid },
    } = useContext(UserContext);
    const [createGroupModal, setCreateGroupModal] = useModal();
    const [joinGroupModal, setJoinGroupModal] = useModal();
    const [editProfileModal, setEditProfileModal] = useModal();

    return (
        <div className="optionsIcon">
            <MdDehaze
                className="ham"
                onClick={() => {
                    setMobileNav(true);
                }}
            />
            <div className="options_wrapper">
                <DropList
                    open={optionsToggle}
                    setter={setOptionsToggle}
                    closeComp={<FaEllipsisH />}
                >
                    <OptionsDropDownItem
                        sufIcon={<MdEdit />}
                        onClickExe={() => {
                            setEditProfileModal(true);
                        }}
                    >
                        Edit Profile
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        sufIcon={mode == "dark" ? <BiSun /> : <BiMoon />}
                        onClickExe={async () => {
                            await firestore
                                .collection(collections.users)
                                .doc(uid)
                                .update({
                                    mode: mode == "dark" ? "light" : "dark",
                                });
                        }}
                    >
                        {mode !== "dark" ? "Turn on Dark mode" : "Turn on Light mode"}
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        onClickExe={() => {
                            setJoinGroupModal(true);
                        }}
                    >
                        Join Group
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        sufIcon={<MdAdd />}
                        onClickExe={() => {
                            setCreateGroupModal(true);
                        }}
                    >
                        Create Group
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        sufIcon={<FaSignOutAlt />}
                        onClickExe={() => {
                            signOut();
                        }}
                    >
                        Sign out
                    </OptionsDropDownItem>
                </DropList>
                <Notification />
            </div>
            <Modal
                header="Create a new Group"
                state={createGroupModal}
                setmodal={setCreateGroupModal}
                classTag="create-group"
            >
                <CreateGroupModalUI setmodal={setCreateGroupModal} />
            </Modal>
            <Modal
                header="Join a Group"
                state={joinGroupModal}
                setmodal={setJoinGroupModal}
                classTag="join-group"
            >
                <JoinGroupModalUI setmodal={setJoinGroupModal} />
            </Modal>
            <Modal
                header="Edit Profile"
                state={editProfileModal}
                setmodal={setEditProfileModal}
                classTag="edit-profile"
            >
                <EditProfile setmodal={setEditProfileModal} />
            </Modal>
        </div>
    );
}

export default Options;

function Notification() {
    const [notif, setNotif] = useState([]);
    const [activeMenu, setActiveMenu] = useState("main");
    const [menuHeight, setMenuHeight] = useState(null);
    const [selectedNotif, setSelectedNotif] = useState(null);
    const [notifToggle, setNotifToggle] = useState(false);
    const [notifIndicator, setNotifIndicator] = useState(false);
    const {
        userlocal: { uid, displayName, groups },
    } = useContext(UserContext);
    const { setSelectedChat } = useContext(SelectedChatContext);
    const Drop = useRef();
    useEffect(() => {
        const unsub = firestore
            .collection(collections.users)
            .doc(uid)
            .collection("notif")
            .onSnapshot((notif) => {
                let list = [];
                notif.forEach((not) => {
                    list.push(not.data());
                });
                list.length == 0 ? setNotifIndicator(false) : setNotifIndicator(true);
                setNotif(list);
            });
        return unsub;
    }, [uid]);

    const notifJSX = notif.map((not) => {
        return (
            <NotifDropDownItem
                gotoMenu="side"
                setActiveMenu={setActiveMenu}
                key={not.notif_id}
                notif={not}
                setSelectedNotif={setSelectedNotif}
            />
        );
    });

    function calcHeight(el) {
        const height = el.offsetHeight + 30;
        setMenuHeight(height);
    }
    return (
        <DropList
            closeComp={<MdNotifications />}
            open={notifToggle}
            setter={setNotifToggle}
            height={menuHeight}
            tag="notif"
            drop={Drop}
            notifIndicator={notifIndicator}
        >
            <CSSTransition
                in={activeMenu === "main"}
                unmountOnExit
                timeout={500}
                classNames="slide"
                onEnter={calcHeight}
            >
                <div className="notif_wrapper">
                    <h4 className="border-bottom pb-2">Notifications</h4>
                    {notifJSX}
                </div>
            </CSSTransition>
            <CSSTransition
                in={activeMenu === "side"}
                unmountOnExit
                timeout={500}
                classNames="side"
                onEnter={calcHeight}
            >
                <div className="notif_wrapper">
                    {selectedNotif && (
                        <>
                            <h4 className="border-bottom pb-2">
                                {selectedNotif.sender} wants to invite you to Thier Group
                            </h4>
                            <p>Accept Invitation?</p>
                            <div className="action">
                                <div
                                    className="hover"
                                    onClick={async () => {
                                        try {
                                            const timestamp = timeStamp();
                                            if (groups.includes(selectedNotif.group_id)) {
                                                return (
                                                    toast.success("You're already in the group!"),
                                                    setSelectedChat(selectedNotif.group_id),
                                                    setActiveMenu("main"),
                                                    setNotifToggle(false),
                                                    await firestore
                                                        .collection(collections.users)
                                                        .doc(uid)
                                                        .collection("notif")
                                                        .doc(selectedNotif.notif_id)
                                                        .delete()
                                                );
                                            }
                                            await firestore
                                                .collection(collections.users)
                                                .doc(uid)
                                                .update({
                                                    groups: firebase.firestore.FieldValue.arrayUnion(
                                                        selectedNotif.group_id
                                                    ),
                                                    updatedAt: timestamp,
                                                });
                                            await firestore
                                                .collection(collections.groups_register)
                                                .doc(selectedNotif.group_id)
                                                .update({
                                                    [feilds.group_members]:
                                                        firebase.firestore.FieldValue.arrayUnion(
                                                            uid
                                                        ),
                                                });
                                            await firestore
                                                .collection(collections.groups_register)
                                                .doc(selectedNotif.group_id)
                                                .collection(collections.messages)
                                                .add({
                                                    type: "bubble",
                                                    tag: "user_joined",
                                                    createdAt: timestamp,
                                                    user_that_joined_id: uid,
                                                    user_that_joined_name: displayName,
                                                });
                                            await firestore
                                                .collection(collections.users)
                                                .doc(uid)
                                                .collection("notif")
                                                .doc(selectedNotif.notif_id)
                                                .delete();
                                            setSelectedChat(selectedNotif.group_id);
                                        } catch (err) {
                                            console.log(err);
                                        }
                                        setActiveMenu("main");
                                        setSelectedNotif(false);
                                    }}
                                >
                                    Yes
                                </div>
                                <div
                                    className="hover"
                                    onClick={() => {
                                        try {
                                            console.log(selectedNotif.notif_id);
                                            firestore
                                                .collection(collections.users)
                                                .doc(uid)
                                                .collection("notif")
                                                .doc(selectedNotif.notif_id)
                                                .delete();
                                        } catch (err) {
                                            console.log(err);
                                        }
                                        setActiveMenu("main");
                                        setSelectedNotif(false);
                                        toast.success("Invitation Declined!");
                                    }}
                                >
                                    No
                                </div>
                                <div
                                    onClick={() => {
                                        setActiveMenu("main");
                                    }}
                                >
                                    Back
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CSSTransition>
        </DropList>
    );
}
