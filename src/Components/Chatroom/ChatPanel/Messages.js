import React, { useContext, useEffect, useRef, useState } from "react";
import { firestore } from "../../../utils/firebase";
import { BiUser } from "react-icons/bi";
import gsap from "gsap";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import $ from "jquery";
function Messages() {
    const { selectedChat } = useContext(SelectedChatContext);
    const messageBoxRef = useRef();
    const [loaded, setLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
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

    useEffect(() => {
        $.isEmptyObject(selectedChat) &&
            firestore
                .collection("groupd-register")
                .doc(selectedChat)
                .collection("messages")
                .orderBy("createdAt")
                .limit(25)
                .onSnapshot((docs) => {
                    const list = [];
                    docs.forEach((doc) => {
                        list.push(doc.data());
                    });
                    setMessages(list);
                });
    }, [selectedChat]);

    return (
        <div className="messages scroll" ref={messageBoxRef}>
            {messages ? (
                messages.map((message, index) =>
                    message.type === "message" ? (
                        <Message key={index} message={message} loaded={loaded} />
                    ) : (
                        <InfoBubble key={index} message={message} />
                    )
                )
            ) : (
                <h4>Select a Group to Se messages</h4>
            )}
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

function InfoBubble({ message }) {
    const {
        userlocal: { uid },
    } = useContext(UserContext);
    const messageOwner = message.uid === uid;
    const [display_name, setDisplay_name] = useState();
    let bubble;
    useEffect(() => {
        firestore
            .collection("users")
            .doc(message.uid)
            .get((data) => setDisplay_name(data));
    }, []);
    switch (message.tag) {
        case "invite_sent":
            bubble = `${messageOwner ? "You" : message.sender} invited ${display_name}`;
    }
    return <div className="info_bubble">{bubble}</div>;
}