import { useState, useContext } from "react";
import { LoaderContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import InviteUsers from "./InviteUsers";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { createGroup, UploadImage } from "../../../utils/firebaseUtils";
function CreateGroupModalUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: null,
        name: "",
        descript: "",
        closed: true,
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [setImageLoader, setSetImageLoader] = useState(false);

    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);

    const { setSelectedChat } = useContext(SelectedChatContext);
    async function setImage(e) {
        setSetImageLoader(true);
        let url = await UploadImage(e.target.files[0], "groups_profile_pic", 1e6);
        setGroupDetails((prev) => {
            return {
                ...prev,
                profile_icon: url,
            };
        });
        setSetImageLoader(false);
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        const id = await createGroup(uid, displayName, groupDetails, selectedUsers);
        setSelectedChat(id);
        setmodal(false);
        setLoading(false);
    }
    return (
        <>
            <div className="form">
                <form onSubmit={submit}>
                    <div className="form_grid">
                        <div className="group_details">
                            <div className="profile_icon">
                                <h4 style={{ margin: "20px 0" }}>Group Profile Icon</h4>
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
                                            in={groupDetails.profile_icon !== null}
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
                                            in={!groupDetails.profile_icon}
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
                            <div className="group_security">
                                <h4 className="mb-3">Group Security</h4>
                                <label>
                                    <input
                                        type="radio"
                                        name="security"
                                        id="Method"
                                        required="required"
                                        checked={!groupDetails.closed}
                                        onChange={() => {
                                            setGroupDetails((prev) => {
                                                return { ...prev, closed: false };
                                            });
                                        }}
                                    />
                                    <span className="label">Open</span>
                                    <span className="bg"></span>
                                    <span className="dot"></span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="security"
                                        id="Method"
                                        required="required"
                                        value="Virtually"
                                        checked={groupDetails.closed}
                                        onChange={() => {
                                            setGroupDetails((prev) => {
                                                return { ...prev, closed: true };
                                            });
                                        }}
                                    />
                                    <span className="label">Closed</span>
                                    <span className="bg"></span>
                                    <span className="dot"></span>
                                </label>
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

export default CreateGroupModalUI;
