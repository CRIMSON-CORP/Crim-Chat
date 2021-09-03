import { useState, useContext } from "react";
import { LoaderContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import firebase, { firestore, timeStamp } from "../../../utils/firebase";
import { ImageTypes } from "../../../utils/utils";
import { v4 } from "uuid";
import InviteUsers from "./InviteUsers";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
function CreateGroupModalUI({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const [groupDetails, setGroupDetails] = useState({
        profile_icon: "",
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
        const image = e.target.files[0];
        setSetImageLoader(true);
        if (!ImageTypes.includes(image.type)) return;
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

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const id = v4();
            const notifid = v4();
            const timestamp = timeStamp();
            // Adds new group to the register
            await firestore
                .collection("groups-register")
                .doc(id)
                .set({
                    group_createdAt: timestamp,
                    group_description: groupDetails.descript,
                    group_id: id,
                    group_name: groupDetails.name,
                    group_profilePic: groupDetails.profile_icon,
                    group_members: [uid],
                    group_security: groupDetails.closed,
                    group_creator_id: uid,
                    updatedAt: timestamp,
                });
            // Adds new group to user's list of groups
            await firestore
                .collection("users")
                .doc(uid)
                .update({
                    groups: firebase.firestore.FieldValue.arrayUnion(id),
                });
            // Send Bubble that user has created the group
            await firestore.collection("groups-register").doc(id).collection("messages").add({
                type: "bubble",
                tag: "group_created",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                group_creator: displayName,
            });
            if (selectedUsers.length !== 0) {
                selectedUsers.forEach(async (user) => {
                    // Send notifications to added users
                    await firestore
                        .collection("users")
                        .doc(user)
                        .collection("notif")
                        .doc(notifid)
                        .set({
                            notif_id: v4(),
                            sender: displayName,
                            type: "invite",
                            group_id: id,
                            sender_id: uid,
                        });
                    // Adds Bubble for each invited user
                    await firestore
                        .collection("groups-register")
                        .doc(id)
                        .collection("messages")
                        .add({
                            type: "bubble",
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            uid: uid,
                            tag: "invite_sent",
                            invitee_id: user,
                            invitee_name: user.displayName,
                            inviter: displayName,
                        });
                });
            }
            setSelectedChat(id);
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
