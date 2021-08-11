import React from "react";
import { auth } from "../../utils/firebase";
import Form from "./Form";
import Messages from "./Messages";
function ChatRoom() {
    return (
        <>
            <Messages />
            <Form />
            <SignOut />
        </>
    );
}
function SignOut() {
    function signOut() {
        auth.currentUser && auth.signOut();
    }
    return (
        <button className="signout" onClick={signOut}>
            Sign Out
        </button>
    );
}

export default ChatRoom;
