import { useContext, useState } from "react";
import { FaEllipsisH, FaSignOutAlt, MdAdd, MdDehaze } from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { MobileNav } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { Modal, useModal } from "../../utils/CustomComponents";
import CreateGroupModalUI from "./CreateGroup/CreateGroupModalUI";

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
