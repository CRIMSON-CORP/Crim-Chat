import { useContext, useState } from "react";
import { FaEllipsisH, FaSignOutAlt, FaUserFriends, MdAdd, MdDehaze, MdEdit } from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { LoaderContext, MobileNav } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { Loader, Modal, ModalInput, useModal } from "../../utils/CustomComponents";
import firebase from "../../utils/firebase";
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
            <Modal
                header="Create a new Group"
                state={createGroupModal}
                setmodal={setCreateGroupModal}
                classTag="create-group"
            >
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
    const { setLoading } = useContext(LoaderContext);
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: "",
        name: "",
        descript: "",
    });
    const [setImageLoader, setSetImageLoader] = useState(false);

    async function setImage(e) {
        const image = e.target.files[0];
        setSetImageLoader(true);
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

    function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Hey");
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
                                    <img src={groupDetails.profile_icon} alt="profile icon" />
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
                                    return { ...prev, descript: e.target.value };
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
