import React, { useState, useContext } from "react";
import firebase, { auth } from "../../utils/firebase";
import { BiEnvelope, BiUser, BsEye, BiKey, BsEyeSlash } from "react-icons/all";
import { ReactComponent as Google } from "../../img/google_colored.svg";
import { IconContext } from "react-icons";
import { InputForm } from "../../utils/CustomComponents";
import { LoaderContext } from "../../utils/Contexts";
import { AddUser, UpdateUserOnlineStatus } from "../../utils/firebaseUtils";
import toast from "react-hot-toast";
function SignUp({ setActivePage }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading } = useContext(LoaderContext);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            await AddUser(auth.currentUser, username);
        } catch (err) {
            console.log(err);
            if (err.code === "auth/invalid-email") {
                toast.error(err.message);
            }
            if (err.code === "auth/email-already-in-use") {
                toast.error("Email already in use!");
            }
            if (err == "auth/network-request-failed") {
                toast.error("Network Error");
            }
        } finally {
            setLoading(false);
        }
    }

    async function signInwithGoogle() {
        setLoading(true);
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
            await AddUser(auth.currentUser);
            await UpdateUserOnlineStatus(auth.currentUser.uid, "Online");
        } catch (err) {
            console.log(err);
            if (err == "auth/network-request-failed") {
                toast.error("A Network Error occured");
            } else if (err.code == "auth/popup-closed-by-user") {
                toast.error("You closed the Popup!");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="signup">
            <IconContext.Provider value={{ size: "1.4em" }}>
                <form onSubmit={submit}>
                    <h1 className="mb-10">Create Profile</h1>
                    <InputForm
                        preicon={<BiUser />}
                        type="text"
                        name="username"
                        onChange={setUsername}
                        value={username}
                        plh={"Username"}
                    />
                    <InputForm
                        preicon={<BiEnvelope />}
                        type="email"
                        name="email"
                        onChange={setEmail}
                        value={email}
                        plh={"Email"}
                    />
                    <InputForm
                        preicon={<BiKey />}
                        suficon={<BsEye />}
                        suficonAlt={<BsEyeSlash />}
                        type="password"
                        name="password"
                        onChange={setPassword}
                        value={password}
                        plh={"Password"}
                    />
                    <button className="signup-btn btn btn-fill" type="submit">
                        Sign Up
                    </button>
                    <button className="login btn btn-outline" type="button" onClick={setActivePage}>
                        Log In
                    </button>
                    <p className="or">
                        <span>or</span>
                    </p>
                    <div className="others">
                        <div
                            className="signin-google other"
                            onClick={() => {
                                signInwithGoogle();
                            }}
                        >
                            <Google /> <p>Sign Up with Google</p>
                        </div>
                    </div>
                </form>
            </IconContext.Provider>
        </div>
    );
}

export default SignUp;
