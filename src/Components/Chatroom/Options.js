import { useContext, useEffect, useState } from "react";
import { FaEllipsisH, FaSignOutAlt, FaUserFriends, MdAdd, MdDehaze, MdEdit } from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { LoaderContext, MobileNav, UserContext } from "../../utils/Contexts";
import { signOut } from "../../utils/firebaseUtils";
import { BorderedInput, Loader, Modal, useModal } from "../../utils/CustomComponents";
import firebase, { firestore } from "../../utils/firebase";
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
                            <InviteUsers />
                        </div>
                    </div>
                    <button className="btn btn-fill">Create Group</button>
                </form>
            </div>
        </>
    );
}

function InviteUsers() {
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
            />
            <UsersList users={users} />
        </div>
    );
}

function UsersList({ users }) {
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const usersRefined = users.map((user) => user.data()).filter((user) => user.uid != uid);
    const usersJSX = usersRefined.map((user) => {
        return (
            <li className="user hover" key={user.uid}>
                <div className="profilepic">
                    <div className="user-online-status">
                        <span className={`online-status ${user.onlineStatus}`}></span>
                    </div>
                    <img src={user.profilePic} alt="" className="profile" />
                </div>
                <div className="user">
                    <h5> {user.displayName}</h5>
                    <span>{user.email}</span>
                </div>
            </li>
        );
    });
    return <ul className="users_list">{usersJSX}</ul>;
}
