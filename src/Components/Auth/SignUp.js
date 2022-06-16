import React, { useContext, useState } from "react";
import { IconContext } from "react-icons";
import { BiEnvelope, BiKey, BiUser, BsEye, BsEyeSlash } from "react-icons/all";
import { LoaderContext } from "../../utils/Contexts";
import { InputForm } from "../../utils/CustomComponents";
import { signup } from "../../utils/firebaseUtils";
function SignUp({ setActivePage }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading } = useContext(LoaderContext);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        await signup(username, email, password);
        setLoading(false);
    }
    return (
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
    );
}

export default SignUp;
