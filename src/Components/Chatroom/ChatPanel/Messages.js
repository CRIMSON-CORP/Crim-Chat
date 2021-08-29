import React, { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../utils/firebase";
import { BiUser } from "react-icons/bi";
import gsap from "gsap";
import { UserContext } from "../../../utils/Contexts";
function Messages() {
    const ref = firestore.collection("messages");
    const messageRef = ref.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(messageRef, { idField: "id" });
    const messageBoxRef = useRef();
    const [loaded, setLoaded] = useState(false);
    const dummy = useRef();
    useEffect(() => {
        if (messages && !loaded) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
            setLoaded(true);
        }
    }, [messages]);
    useEffect(() => {
        loaded && dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="messages" ref={messageBoxRef}>
            {messages &&
                messages.map((message, index) => (
                    <Message key={index} message={message} loaded={loaded} />
                ))}
            <div ref={dummy}></div>
        </div>
    );
}
export default Messages;

function Message({ message, loaded }) {
    const { userlocal } = useContext(UserContext);
    let messageOwner;
    if (message.uid) {
        messageOwner = message.uid === userlocal.uid;
    }
    const messageRef = useRef();
    useEffect(() => {
        if (loaded) {
            gsap.fromTo(
                messageRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                }
            );
        }
    }, []);
    return (
        <div ref={messageRef} className={`message ${messageOwner ? "sent" : "received"}`}>
            <div className="img_profile">
                {message.profilePhoto === null ? (
                    <BiUser size={22} />
                ) : (
                    <img src={message.profilePhoto} alt="profile" />
                )}
            </div>
            <Bubble message={message} messageOwner={messageOwner} loaded={loaded} />
        </div>
    );
}

function Bubble({ message: { text, createdAt, sender }, messageOwner, loaded }) {
    const time =
        createdAt !== null && createdAt !== undefined
            ? new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6).toLocaleTimeString()
            : "";

    const bubble = useRef();
    useEffect(() => {
        if (loaded) {
            if (text.length > 200) {
                gsap.fromTo(
                    bubble.current,
                    {
                        scale: 0.8,
                        opacity: 0,
                        y: 10,
                    },
                    { scale: 1, opacity: 1, y: 0, duration: 2, ease: "expo.out" }
                );
            } else {
                gsap.fromTo(
                    bubble.current,
                    {
                        scale: 0.5,
                        rotate: messageOwner ? "20deg" : "-20deg",
                        transformOrigin: messageOwner ? "80% 20%" : "20% 20%",
                    },
                    {
                        scale: 1,
                        rotate: "0deg",
                    }
                );
            }
        }
    }, []);
    return (
        <div className="bubble" ref={bubble}>
            <div className="text">
                {!messageOwner && <div className="message_sender">{sender}</div>}
                <p>{text}</p>
            </div>
            <div className="timestamp">{time}</div>
        </div>
    );
}
