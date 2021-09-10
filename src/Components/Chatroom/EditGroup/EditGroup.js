import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { LoaderContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import { firestore, timeStamp } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";
import { UploadImage } from "../../../utils/firebaseUtils";
function EditGroupUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const [groupDetails, setGroupDetails] = useState(null);

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
        setSetImageLoader(true);
        UploadImage(image, "groups_profile_pic/" + image.name)
            .then((url) => {
                setGroupDetails((prev) => {
                    return { ...prev, group_profilePic: url };
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setSetImageLoader(false);
            });
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const timestamp = timeStamp();
            //updates group details
            await firestore.collection("groups-register").doc(selectedChat).update(groupDetails);

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
                                                in={groupDetails.group_profilePic != ""}
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
                                                in={groupDetails.group_profilePic == ""}
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
                                                return { ...prev, group_name: e.target.value };
                                            });
                                        }}
                                        value={" "}
                                        label={groupDetails.group_name}
                                        req={false}
                                    />
                                </div>
                                <div className="group_descript">
                                    <BorderedInput
                                        header="Group Description"
                                        name="group_description"
                                        onChange={(e) => {
                                            setGroupDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    group_description: e.target.value,
                                                };
                                            });
                                        }}
                                        label={groupDetails.group_description}
                                        value={" "}
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
