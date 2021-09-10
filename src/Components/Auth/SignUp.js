import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { IconContext } from "react-icons";
import { BiEnvelope, BiKey, BiUser, BsEye, BsEyeSlash } from "react-icons/all";
import { LoaderContext } from "../../utils/Contexts";
import { InputForm } from "../../utils/CustomComponents";
import { auth } from "../../utils/firebase";
import { AddUser } from "../../utils/firebaseUtils";
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
            if (err.code == "auth/network-request-failed") {
                toast.error("Network Error");
            }
            if (err.code == "auth/weak-password") {
                toast.error(err.message);
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
                </form>
            </IconContext.Provider>
        </div>
    );
}

export default SignUp;
