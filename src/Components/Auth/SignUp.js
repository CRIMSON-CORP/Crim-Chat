import React from "react";
import firebase, { auth } from "../../utils/firebase";

function SignUp() {
    async function signIn() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <button className="signin" onClick={signIn}>
            Sign In
        </button>
    );
}

export default SignUp;
