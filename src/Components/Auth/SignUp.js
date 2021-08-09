import React, { useState } from "react";
import firebase, { auth } from "../../utils/firebase";
import { BiUser } from "react-icons/all";
function SignUp() {
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
    return (
        <div className="signup">
            <form action="">
                <h1>Create Profile</h1>
                <BiUser />
                <InputForm />
                <button className="signin" onClick={signIn}>
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default SignUp;

function InputForm({ preicon, type, suficon, name, onChange, value }) {
    return (
        <div className="input_Feild">
            {preicon}
            <input type={type} name={name} value={value} onChange={onChange} />
            {suficon}
        </div>
    );
}
