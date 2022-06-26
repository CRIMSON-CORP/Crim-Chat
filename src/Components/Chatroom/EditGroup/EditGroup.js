import { useContext, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { LoaderContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import { firestore } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";
import { updateGroup, UploadImage } from "../../../utils/firebaseUtils";
function EditGroupUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const [groupDetails, setGroupDetails] = useState(null);
    const [setImageLoader, setSetImageLoader] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [former, setFormer] = useState();
    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);

    useEffect(() => {
        firestore
            .collection(collections.groups_register)
            .doc(selectedChat)
            .get()
            .then((data) => {
                setFormer(data.data());
                setGroupDetails(data.data());
            });
    }, []);

    async function setImage(e) {
        const image = e.target.files[0];
        setSetImageLoader(true);
        const url = await UploadImage(image, "groups_profile_pic/" + image.name);
        setGroupDetails((prev) => {
            return { ...prev, group_profilePic: url };
        });
        setSetImageLoader(false);
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await updateGroup(uid, displayName, selectedChat, groupDetails);
            setmodal(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {groupDetails && (
                <div className="form">
                    <form onSubmit={submit}>
                        <div className="form_grid" style={{ gridTemplateColumns: "100%" }}>
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
                                                in={groupDetails.group_profilePic != null}
                                                unmountOnExit
                                                timeout={400}
                                                classNames="profile_icon_switch_img"
                                            >
                                                <img
                                                    src={groupDetails.group_profilePic}
                                                    alt="profile icon"
                                                />
                                            </CSSTransition>
                                            <CSSTransition
                                                in={groupDetails.group_profilePic == null}
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
                                            setGroupName(e.target.value);
                                            setGroupDetails((prev) => {
                                                return { ...prev, group_name: e.target.value };
                                            });
                                        }}
                                        value={groupName}
                                        label={former.group_name}
                                        req={false}
                                    />
                                </div>
                                <div className="group_descript">
                                    <BorderedInput
                                        header="Group Description"
                                        name="group_description"
                                        onChange={(e) => {
                                            setGroupDescription(e.target.value);
                                            setGroupDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    group_description: e.target.value,
                                                };
                                            });
                                        }}
                                        label={former.group_description}
                                        value={groupDescription}
                                        req={false}
                                    />
                                </div>
                                <div className="group_security">
                                    <h4 className="mb-3">Group Security</h4>
                                    <div
                                        onChange={(e) => {
                                            setGroupDetails((prev) => {
                                                let check =
                                                    e.target.value === "true" ? true : false;
                                                return { ...prev, group_security: check };
                                            });
                                        }}
                                    >
                                        <label>
                                            <input
                                                type="radio"
                                                name="security"
                                                id="Method"
                                                value={false}
                                                defaultChecked={!groupDetails.group_security}
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
                                                value={true}
                                                defaultChecked={groupDetails.group_security}
                                            />
                                            <span className="label">Closed</span>
                                            <span className="bg"></span>
                                            <span className="dot"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-fill">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default EditGroupUI;
