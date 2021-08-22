import React, { useContext, useState } from "react";
import firebase, { auth } from "../../utils/firebase";
import { BiEnvelope, BsEye, BiKey, BsEyeSlash } from "react-icons/all";
import { ReactComponent as Google } from "../../img/google_colored.svg";
import { IconContext } from "react-icons";
import { InputForm } from "../../utils/CustomComponents";
import { LoaderContext } from "../../utils/Contexts";
import { Notification } from "../../utils/utils";
import { AddUser, UpdateUserOnlineStatus } from "../../utils/firebaseUtils";
function SignIn({ setActivePage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading } = useContext(LoaderContext);
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
                Notification("danger", "Network Error", "Network connection is unstable!");
            }
        } finally {
            setLoading(false);
        }
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            await UpdateUserOnlineStatus(auth.currentUser.uid, "Online");
        } catch (err) {
            console.log(err);
            if (err.code === "auth/wrong-password") {
                Notification(
                    "danger",
                    "Incorrect Password",
                    "The Password is incorrect for this User!"
                );
                setPassword("");
            } else if (err.code === "auth/too-many-requests") {
                Notification(
                    "danger",
                    "Access Temporarily Blocked",
                    "Too many incorrect tries, Account Temporarily Blocked!"
                );
                setEmail("");
                setPassword("");
            } else if (err.code === "auth/invalid-email") {
                Notification("danger", "Error", err.message);
            } else if (err.code === "auth/user-not-found") {
                Notification(
                    "warning",
                    "No Account Found!",
                    "User with this Account does not Exist!"
                );
            }
            if (err == "auth/network-request-failed") {
                Notification("danger", "Network Error", "Network connection is unstable!");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="signup">
            <IconContext.Provider value={{ size: "1.4em" }}>
                <form onSubmit={submit}>
                    <h1 className="mb-10">Log In</h1>
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
                        Log In
                    </button>
                    <button className="login btn btn-outline" type="button" onClick={setActivePage}>
                        Sign Up
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
                            <Google /> <p>Sign In with Google</p>
                        </div>
                    </div>
                </form>
            </IconContext.Provider>
        </div>
    );
}

export default SignIn;
