import React, { useContext, useState } from "react";
import { IconContext } from "react-icons";
import { BiEnvelope, BiKey, BsEye, BsEyeSlash } from "react-icons/all";
import { LoaderContext } from "../../utils/Contexts";
import { InputForm } from "../../utils/CustomComponents";
import { signin } from "../../utils/firebaseUtils";
function SignIn({ setActivePage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading } = useContext(LoaderContext);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        await signin(email, password, setEmail, setPassword);
        setLoading(false);
    }
    return (
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
    );
}

export default SignIn;
