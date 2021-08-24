import { useContext, useState } from "react";
import { FaEllipsisH, FaSignOutAlt, FaUserFriends, MdAdd, MdDehaze } from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { MobileNav } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { Modal, ModalInput, useModal } from "../../utils/CustomComponents";
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
                                }}
                            >
                                Create Group
                            </OptionsDropDownItem>
                            <OptionsDropDownItem sufIcon={<FaSignOutAlt />} onClickExe={signOut}>
                                Sign out
                            </OptionsDropDownItem>
                        </OptionsDropDown>
                    </CSSTransition>
                </OnOutsiceClick>
            </div>
            <Modal state={createGroupModal} setmodal={setCreateGroupModal} classTag="create-group">
                <CreateGroupModalUI />
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

function CreateGroupModalUI() {
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: "",
        name: "",
        descript: "",
    });
    return (
        <>
            <div className="modal-head">
                <h3>Create a new Group</h3>
            </div>
            <div className="form">
                <form>
                    <div className="profile_icon">
                        <h4>Group Profile Icon</h4>
                        <input
                            type="file"
                            name="group-profile-icon"
                            accept="image/png, image/jpeg,image/jpg, image/JPEG, image/webpg"
                            id="profile-icon"
                        />
                        <label htmlFor="profile-icon" className="profile_icon">
                            <FaUserFriends />
                        </label>
                    </div>
                    <div className="group_name">
                        <ModalInput
                            header="Group name"
                            name="group_name"
                            onChange={(e) => {
                                setGroupDetails((prev) => {
                                    return { ...prev, name: e.target.value };
                                });
                            }}
                            plh="Name"
                            type="text"
                            value={groupDetails.name}
                            req={true}
                        />
                    </div>
                    <div className="group_descript">
                        <ModalInput
                            header="Group Description"
                            name="group_description"
                            onChange={(e) => {
                                setGroupDetails((prev) => {
                                    return { ...prev, description: e.target.value };
                                });
                            }}
                            plh="Description"
                            type="text"
                            value={groupDetails.descript}
                        />
                    </div>
                    <button className="btn btn-fill">Create Group</button>
                </form>
            </div>
        </>
    );
}
