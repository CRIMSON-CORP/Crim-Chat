import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "../../../utils/firebase";
import { BiUser } from "react-icons/bi";
function Messages({ dummy }) {
    const ref = firestore.collection("messages");
    const messageRef = ref.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(messageRef, { idField: "id" });
    return (
        <div className="messages">
            {messages &&
                messages.map((message, index) => <Message key={index} message={message} />)}
            <div className="dummy" ref={dummy} style={{ marginTop: -5 }}></div>
        </div>
    );
}
export default Messages;

function Message({ message }) {
    const [user] = useAuthState(auth);
    const messageOwner = message.uid === user.uid;
    const time =
        message.createdAt !== null
            ? new Date(
                  message.createdAt.seconds * 1000 + message.createdAt.nanoseconds / 1e6
              ).toLocaleTimeString()
            : "";

    return (
        <div className={`message ${messageOwner ? "sent" : "received"}`}>
            <div className="img_profile">
                {message.profilePhoto === null ? (
                    <BiUser size={22} />
                ) : (
                    <img src={message.profilePhoto} alt="profile" />
                )}
                {/* <div className="user-online-status">
                   {messageOwner ? (
                        <span className={`online-status ${user.onlineStatus}`}></span>
                    ) : (
                        <span className={`online-status ${sender.onlineStatus}`}></span>
                    )}
                </div> */}
            </div>
            <div className="bubble">
                <div className="text">
                    {!messageOwner && <div className="message_sender">{message.sender}</div>}
                    <p>{message.text}</p>
                </div>
                <div className="timestamp">{time}</div>
            </div>
        </div>
    );
}
