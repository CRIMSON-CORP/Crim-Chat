import { useContext, useState } from "react";
import { FaEllipsisH, FaSignOutAlt, MdAdd, MdDehaze, MdEdit } from "react-icons/all";
import { MobileNav } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { DropList, Modal, OptionsDropDownItem, useModal } from "../../utils/CustomComponents";
import CreateGroupModalUI from "./CreateGroup/CreateGroupModalUI";
import JoinGroupModalUI from "./JoinGroup/JoinGroupModalUI";
import EditProfile from "./EditProfile/EditProfile";

function Options() {
    const [optionsToggle, setOptionsToggle] = useState(false);
    const { setMobileNav } = useContext(MobileNav);
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
