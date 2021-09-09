import React, { useContext, useState } from "react";
import firebase, { auth } from "../../utils/firebase";
import { BiEnvelope, BsEye, BiKey, BsEyeSlash } from "react-icons/all";
import { IconContext } from "react-icons";
import { InputForm } from "../../utils/CustomComponents";
import { LoaderContext } from "../../utils/Contexts";
import { UpdateUserOnlineStatus } from "../../utils/firebaseUtils";
import toast from "react-hot-toast";
function SignIn({ setActivePage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading } = useContext(LoaderContext);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        async function signin() {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            await UpdateUserOnlineStatus(auth.currentUser.uid, "Online");
        }
        try {
            await toast.promise(signin(), {
                loading: "Signing in...",
                success: "Signed in Successfully!",
                error: "Failed to Sign in!",
            });
        } catch (err) {
            console.log(err);
            if (err.code === "auth/wrong-password") {
                toast.error("The Password is incorrect for this User!");
                setPassword("");
            } else if (err.code === "auth/too-many-requests") {
                toast.error("Too many incorrect tries, Account Temporarily Blocked!");
                setEmail("");
                setPassword("");
            } else if (err.code === "auth/invalid-email") {
                toast.error(err.message);
            } else if (err.code === "auth/user-not-found") {
                toast.error("User with this Account does not Exist!");
            } else if (err.code == "auth/network-request-failed") {
                return toast.error("Network Error");
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
                </form>
            </IconContext.Provider>
        </div>
    );
}

export default SignIn;
