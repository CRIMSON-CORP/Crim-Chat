import { useState, useContext, useEffect } from "react";
import { LoaderContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput, Loader } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { ImageTypes } from "../../../utils/utils";
import { CSSTransition } from "react-transition-group";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { collections } from "../../../utils/FirebaseRefs";
function EditProfile({ setmodal }) {
    const { setLoading } = useContext(LoaderContext);
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const [profileDetails, setProfileDetails] = useState({
        profilePic: null,
        displayName: "",
    });

    useEffect(() => {
        firestore
            .collection(collections.users)
            .doc(uid)
            .get()
            .then((data) => {
                setProfileDetails(data.data());
            });
    }, []);

    const [setImageLoader, setSetImageLoader] = useState(false);

    async function setImage(e) {
        const image = e.target.files[0];
        if (!image) return;
        if (image.size > 1000_000) return toast.error("Please select a picture less than 1mb");
        if (!ImageTypes.includes(image.type)) return toast.error("Please select a picture");
        setSetImageLoader(true);
        try {
            const ref = firebase.storage().ref("users_profile_pic/" + image.name);
            await ref.put(image);
            const url = await ref.getDownloadURL();
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
                                    }}
                                    value={" "}
                                    label={profileDetails.displayName}
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
                                        await firestore
                                            .collection(collections.users)
                                            .doc(uid)
                                            .delete();
                                        await firebase
                                            .auth()
                                            .currentUser.delete(uid)
                                            .then(() => {
                                                localStorage.removeItem("user");
                                                toast.success("Account Deleted!");
                                            });
                                    } catch {
                                        toast.error("Faailed to Delete Account!");
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
        </>
    );
}

export default EditProfile;
