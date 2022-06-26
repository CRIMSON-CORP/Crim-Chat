import { useState, useContext, useEffect } from "react";
import { LoaderContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import { firestore } from "../../../utils/firebase";
import { CSSTransition } from "react-transition-group";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { collections } from "../../../utils/FirebaseRefs";
import { deleteAccount, UploadImage } from "../../../utils/firebaseUtils";
function EditProfile({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const [profileDetails, setProfileDetails] = useState(null);
    const [former, setFormer] = useState();
    const [text, setText] = useState("");

    useEffect(() => {
        firestore
            .collection(collections.users)
            .doc(uid)
            .get()
            .then((data) => {
                setProfileDetails(data.data());
                setFormer(data.data().displayName);
            });
    }, []);

    const [setImageLoader, setSetImageLoader] = useState(false);

    async function setImage(e) {
        const image = e.target.files[0];
        setSetImageLoader(true);
        try {
            const url = await UploadImage(image, "users_profile_pic/" + image.name);
            setProfileDetails((prev) => {
                return { ...prev, profilePic: url };
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
            await firestore.collection(collections.users).doc(uid).update(profileDetails);
            toast.success("Profile Details updated successfully");
            setmodal(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {profileDetails && (
                <div className="form">
                    <form onSubmit={submit}>
                        <div className="form_grid" style={{ gridTemplateColumns: "100%" }}>
                            <div className="profile_details">
                                <div className="profile_icon">
                                    <h4 style={{ marginBottom: 20 }}>Profile Icon</h4>
                                    <input
                                        type="file"
                                        name="profile-icon"
                                        accept="image/png, image/jpeg,image/jpg, image/JPEG, image/webpg"
                                        id="profile-icon"
                                        onChange={setImage}
                                    />
                                    <label htmlFor="profile-icon" className="profile_icon">
                                        <div className="cover">
                                            <CSSTransition
                                                in={profileDetails.profilePic != null}
                                                unmountOnExit
                                                timeout={400}
                                                classNames="profile_icon_switch_img"
                                            >
                                                <img
                                                    src={profileDetails.profilePic}
                                                    alt="profile icon"
                                                />
                                            </CSSTransition>
                                            <CSSTransition
                                                in={profileDetails.profilePic == null}
                                                unmountOnExit
                                                timeout={400}
                                                classNames="profile_icon_switch_svg"
                                            >
                                                <span className="profile_icon_placeholder">
                                                    <FaUser size={40} />
                                                </span>
                                            </CSSTransition>
                                            {setImageLoader && <Loader />}
                                        </div>
                                        <span className="edit">
                                            <MdEdit />
                                        </span>
                                    </label>
                                </div>
                                <div className="display_name">
                                    <BorderedInput
                                        name="display_name"
                                        header="Display name"
                                        onChange={(e) => {
                                            setProfileDetails((prev) => {
                                                return { ...prev, displayName: e.target.value };
                                            });
                                            setText(e.target.value);
                                        }}
                                        value={text}
                                        label={former}
                                        req={false}
                                    />
                                </div>
                            </div>
                            <button
                                className="btn-block btn-danger px-3 py-2 rounded"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    const ans = confirm(
                                        "Are you sure you want to delete your account? you can sign out instead"
                                    );
                                    if (ans) {
                                        try {
                                            await deleteAccount(uid);
                                        } catch {
                                            toast.error("Failed to Delete Account!");
                                        }
                                    }
                                }}
                            >
                                Delete Account?
                            </button>
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

export default EditProfile;
