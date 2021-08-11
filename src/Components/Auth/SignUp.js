import React, { useState } from "react";
import firebase, { auth } from "../../utils/firebase";
import { BiEnvelope, BiUser, BsEye, BiKey, BsEyeSlash } from "react-icons/all";
import { ReactComponent as Google } from "../../img/google_colored.svg";
import { ReactComponent as Facebook } from "../../img/facebook_colored.svg";
import { IconContext } from "react-icons";
import { InputForm } from "../../utils/CustomComponents";
import { Notification } from "../../utils/utils";
function SignUp({ setActivePage }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    async function signIn() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider);
        } catch (err) {
            console.log(err);
        }
    }

    async function submit(e) {
        e.preventDefault();
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.createUserWithEmailAndPassword(email, password);
            AddUser(auth.currentUser, username);
        } catch (err) {
            console.log(err);
            if (err.code === "auth/invalid-email") {
                Notification("danger", "Error", err.message);
            }
            if (err.code === "auth/email-already-in-use") {
                Notification("danger", "Email already in use!", err.message);
            }
        }
    }

    async function signInwithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
            AddUser(auth.currentUser);
        } catch (err) {
            console.log(err);
        }
    }
    async function signInwithFacebook() {
        try {
            const provider = new firebase.auth.FacebookAuthProvider();
            auth.signInWithPopup(provider);
            AddUser(auth.currentUser);
        } catch (err) {
            console.log(err);
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
                        <div
                            className="signin-facebook other"
                            onClick={() => {
                                signInwithFacebook();
                            }}
                        >
                            <Facebook />
                            <p>Sign Up with Facebook</p>
                        </div>
                    </div>
                </form>
            </IconContext.Provider>
        </div>
    );
}

export default SignUp;

export async function AddUser(currentUser, username) {
    const user = await firebase.firestore().collection("users").doc(`${currentUser.uid}`).get();
    if (!user.exists) {
        return await firebase
            .firestore()
            .collection("users")
            .doc(`${currentUser.uid}`)
            .set({
                username: username || currentUser.displayName,
                profile: currentUser.photoURL,
                onlineStatus: true,
                uid: currentUser.uid,
                typing: false,
                groups: [],
                chats: [],
            });
    } else return;
}
