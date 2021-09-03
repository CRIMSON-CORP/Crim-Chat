import { useState, useContext, useEffect } from "react";
import { LoaderContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import firebase, { firestore, timeStamp } from "../../../utils/firebase";
import { ImageTypes } from "../../../utils/utils";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { collections } from "../../../utils/FirebaseRefs";
function EditGroupUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: "",
        name: "",
        descript: "",
        closed: true,
    });

    const [newDetails, setNewDetails] = useState({
        group_profilePic: null,
        group_description: "",
        group_name: "",
        closed: groupDetails.closed,
    });

    useEffect(() => {
        firestore
            .collection(collections.groups_register)
            .doc(selectedChat)
            .get()
            .then((data) => {
                setGroupDetails(data.data());
            });
    }, []);

    const [setImageLoader, setSetImageLoader] = useState(false);

    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);
    async function setImage(e) {
        const image = e.target.files[0];
        if (!image) return;
        setSetImageLoader(true);
        if (!ImageTypes.includes(image.type)) return;
        try {
            const ref = firebase.storage().ref("groups_profile_pic/" + image.name);
            await ref.put(image);
            const url = await ref.getDownloadURL();
            setNewDetails((prev) => {
                return { ...prev, group_profilePic: url };
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
            const timestamp = timeStamp();
            //updates group details
            await firestore
                .collection("groups-register")
                .doc(selectedChat)
                .update({
                    group_description:
                        newDetails.group_description == ""
                            ? groupDetails.group_description
                            : newDetails.group_description,
                    group_name:
                        newDetails.group_name == ""
                            ? groupDetails.group_name
                            : newDetails.group_name,
                    group_profilePic:
                        newDetails.group_profilePic == null
                            ? groupDetails.group_profilePic
                            : newDetails.group_profilePic,
                    group_security: newDetails.closed,
                    updatedAt: timestamp,
                });

            // Send Bubble that user has updated the group
            await firestore
                .collection("groups-register")
                .doc(selectedChat)
                .collection("messages")
                .add({
                    type: "bubble",
                    tag: "group_updated",
                    admin: displayName,
                    admin_uid: uid,
                    createdAt: timestamp,
                });
            toast.success("Group Details updated successfully");
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
                                            in={
                                                groupDetails.group_profilePic != null ||
                                                newDetails.group_profilePic != null
                                            }
                                            unmountOnExit
                                            timeout={400}
                                            classNames="profile_icon_switch_img"
                                        >
                                            <img
                                                src={
                                                    newDetails.group_profilePic ||
                                                    groupDetails.group_profilePic
                                                }
                                                alt="profile icon"
                                            />
                                        </CSSTransition>
                                        <CSSTransition
                                            in={
                                                groupDetails.group_profilePic == null &&
                                                newDetails.group_profilePic == null
                                            }
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
                                        setNewDetails((prev) => {
                                            return { ...prev, group_name: e.target.value };
                                        });
                                    }}
                                    value={newDetails.group_name}
                                    label={groupDetails.group_name}
                                    req={false}
                                />
                            </div>
                            <div className="group_descript">
                                <BorderedInput
                                    header="Group Description"
                                    name="group_description"
                                    onChange={(e) => {
                                        setNewDetails((prev) => {
                                            return { ...prev, group_description: e.target.value };
                                        });
                                    }}
                                    label={groupDetails.group_description}
                                    value={newDetails.group_description}
                                    req={false}
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
                    </div>
                    <button type="submit" className="btn btn-fill">
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
}

export default EditGroupUI;
