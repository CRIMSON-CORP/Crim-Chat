import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "../../../utils/firebase";
function Messages() {
    const ref = firestore.collection("messages");
    const messageRef = ref.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(messageRef, { idField: "id" });
    return (
        <div className="messages">
            {messages &&
                messages.map((message, index) => <Message key={index} message={message} />)}
        </div>
    );
}
export default Messages;

function Message({ message }) {
    const [user] = useAuthState(auth);
    const time = new Date(message.createdAt.seconds * 1000 + message.createdAt.nanoseconds / 1e6);
    return (
        <div className={`message ${message.uid === user.uid ? "sent" : "received"}`}>
            <div className="img_profile">
                <img src={message.profilePhoto} alt="profile" />
                <div className="user-online-status">
                    <span className={`online-status ${user.onlineStatus}`}></span>
                </div>
            </div>
            <div className="bubble">
                <div className="text">
                    <p>{message.text}</p>
                </div>
                <div className="timestamp">{time.toLocaleTimeString()}</div>
            </div>
        </div>
    );
}
