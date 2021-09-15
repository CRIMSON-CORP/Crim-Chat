import { useContext, useRef, useState } from "react";
import {
    BiMoon,
    BiSun,
    FaEllipsisH,
    FaSignOutAlt,
    MdAdd,
    MdDehaze,
    MdEdit,
    MdNotifications,
    MdKeyboardArrowLeft,
    MdClear,
    MdCheck,
    FiEdit,
} from "react-icons/all";
import {
    CreateJoinContext,
    MobileNav,
    SelectedChatContext,
    UserContext,
} from "../../utils/Contexts";
import { deleteUserNotification, signOut, updateUserMode } from "../../utils/firebaseUtils";
import {
    DropList,
    Modal,
    NotifDropDownItem,
    OptionsDropDownItem,
} from "../../utils/CustomComponents";
import CreateGroupModalUI from "./CreateGroup/CreateGroupModalUI";
import JoinGroupModalUI from "./JoinGroup/JoinGroupModalUI";
import EditProfile from "./EditProfile/EditProfile";
import { firestore } from "../../utils/firebase";
import { collections } from "../../utils/FirebaseRefs";
import { CSSTransition } from "react-transition-group";
import toast from "react-hot-toast";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Options() {
    const [optionsToggle, setOptionsToggle] = useState(false);
    const { setMobileNav } = useContext(MobileNav);
    const {
        userlocal: { mode, uid },
    } = useContext(UserContext);
    const {
        createGroupModal,
        setCreateGroupModal,
        joinGroupModal,
        setJoinGroupModal,
        editProfileModal,
        setEditProfileModal,
    } = useContext(CreateJoinContext);

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
                            await updateUserMode(uid, mode);
                        }}
                    >
                        {mode !== "dark" ? "Turn on Dark mode" : "Turn on Light mode"}
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        onClickExe={() => {
                            setJoinGroupModal(true);
                        }}
                        sufIcon={<MdAdd />}
                    >
                        Join Group
                    </OptionsDropDownItem>
                    <OptionsDropDownItem
                        sufIcon={<FiEdit />}
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
    const [activeMenu, setActiveMenu] = useState("main");
    const [menuHeight, setMenuHeight] = useState(null);
    const [selectedNotif, setSelectedNotif] = useState(null);
    const [notifToggle, setNotifToggle] = useState(false);
    const {
        userlocal: { uid, groups },
    } = useContext(UserContext);
    const { setSelectedChat } = useContext(SelectedChatContext);
    const ref = firestore.collection(collections.users).doc(uid).collection("notif");
    const [notifList = []] = useCollectionData(ref, { idField: "notif_id" });

    const notifJSX = notifList.map((not) => {
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
    console.log(123);
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
            notifIndicator={notifJSX.length}
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
                                            if (groups.includes(selectedNotif.group_id)) {
                                                return (
                                                    toast.success("You're already in the group!"),
                                                    setSelectedChat(selectedNotif.group_id),
                                                    setActiveMenu("main"),
                                                    setNotifToggle(false),
                                                    await deleteUserNotification(uid, selectedNotif)
                                                );
                                            }
                                            setSelectedChat(selectedNotif.group_id);
                                        } catch (err) {
                                            console.log(err);
                                        } finally {
                                            setActiveMenu("main");
                                            setSelectedNotif(false);
                                        }
                                    }}
                                >
                                    <MdCheck />
                                    <span>Yes</span>
                                </div>
                                <div
                                    className="hover"
                                    onClick={() => {
                                        try {
                                            deleteUserNotification(uid, selectedNotif);
                                        } catch (err) {
                                            console.log(err);
                                        }
                                        setActiveMenu("main");
                                        setSelectedNotif(false);
                                        toast.success("Invitation Declined!");
                                    }}
                                >
                                    <MdClear />
                                    <span>No</span>
                                </div>
                                <div
                                    onClick={() => {
                                        setActiveMenu("main");
                                    }}
                                >
                                    <MdKeyboardArrowLeft />
                                    <span>Back</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CSSTransition>
        </DropList>
    );
}
