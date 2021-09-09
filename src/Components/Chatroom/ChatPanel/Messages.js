import React, { useContext, useEffect, useRef, useState } from "react";
import firebase, { firestore } from "../../../utils/firebase";
import { BiUser } from "react-icons/bi";
import gsap from "gsap";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { FaEllipsisH, FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { DropList, OptionsDropDownItem, useModal } from "../../../utils/CustomComponents";
import { collections, feilds } from "../../../utils/FirebaseRefs";
import toast from "react-hot-toast";
import { MdAdd, MdEdit, MdInfoOutline } from "react-icons/md";
import $ from "jquery";
import MessagesModal from "./MessagesModal";
import aud from "../../../img/facebookchat.mp3";
import useSound from "use-sound";
function Messages({ setCaret }) {
    const { selectedChat, setSelectedChat } = useContext(SelectedChatContext);
    const {
        userlocal: { uid, displayName },
    } = useContext(UserContext);
    const messageBoxRef = useRef();
    const [loaded, setLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [groupDetails, setGroupDetails] = useState();
    const [optionsToggle, setOptionsToggle] = useState(false);
    const [editGroupModal, setEditGroupModal] = useModal(false);
    const [addUsers, setAddUsers] = useState(false);
    const [groupInfoModal, setGroupInfoModal] = useModal(false);
    const [play] = useSound(aud);
    const [allowedToPlay, setAllowedToPlay] = useState(true);
    const dummy = useRef();
    useEffect(() => {
        if (messages) {
            if (loaded) {
                dummy.current.scrollIntoView({ behavior: "smooth" });
                if (allowedToPlay) {
                    play();
                    setAllowedToPlay(false);
                }
                setTimeout(() => {
                    setAllowedToPlay(true);
                }, 1500);
            } else {
                dummy.current.scrollIntoView({ behavior: "auto" });
                setLoaded(true);
            }
        }
    }, [messages]);

    useEffect(() => {
        if (selectedChat) {
            setLoaded(false);
            var unsub1 = firestore
                .collection(collections.groups_register)
                .doc(selectedChat)
                .collection("messages")
                .orderBy("createdAt")
                .limit(100)
                .onSnapshot((docs) => {
                    const list = [];
                    docs.forEach((doc) => {
                        list.push(doc.data());
                    });
                    setMessages(list);
                });
            var unsub2 = firestore
                .collection("groups-register")
                .doc(selectedChat)
                .onSnapshot((docs) => {
                    setGroupDetails(docs.data());
                });
        }
        return () => {
            unsub1;
            unsub2;
        };
    }, [selectedChat]);

    useEffect(() => {
        messageBoxRef.current.addEventListener("scroll", () => {
            let scrolltop =
                $(messageBoxRef.current).scrollTop() + $(messageBoxRef.current).height();
            if (scrolltop < messageBoxRef.current.scrollHeight - 50) {
                setCaret(true);
            } else {
                setCaret(false);
            }
        });
    }, []);
    useEffect(() => {
        return () => {
            setGroupDetails([]);
            setLoaded(false);
            setMessages([]);
        };
    }, []);

    return (
        <div className="messages scroll" ref={messageBoxRef}>
            {groupDetails && selectedChat !== "" && (
                <div className="messages_header">
                    <div
                        className="head"
                        onClick={() => {
                            setGroupInfoModal(true);
                        }}
                    >
                        <div className="group_profilePic">
                            {groupDetails.group_profilePic ? (
                                <img src={groupDetails.group_profilePic} />
                            ) : (
                                <FaUserFriends size={20} />
                            )}
                        </div>
                        <div className="name trim">
                            <h5 className="trim-text">{groupDetails.group_name}</h5>
                            {/* <span>{groupDetails.group_description}</span> */}
                        </div>
                    </div>
                    <div className="messages_options">
                        <DropList
                            closeComp={<FaEllipsisH />}
                            setter={setOptionsToggle}
                            open={optionsToggle}
                        >
                            <OptionsDropDownItem
                                sufIcon={<MdInfoOutline />}
                                onClickExe={() => {
                                    setGroupInfoModal(true);
                                }}
                            >
                                Group Information
                            </OptionsDropDownItem>
                            {groupDetails.group_creator_id === uid && (
                                <>
                                    <OptionsDropDownItem
                                        sufIcon={<MdEdit />}
                                        onClickExe={() => {
                                            setEditGroupModal(true);
                                        }}
                                    >
                                        Edit Group
                                    </OptionsDropDownItem>
                                    <OptionsDropDownItem
                                        sufIcon={<MdAdd />}
                                        onClickExe={() => {
                                            setAddUsers(true);
                                        }}
                                    >
                                        Add a new User
                                    </OptionsDropDownItem>
                                </>
                            )}
                            <OptionsDropDownItem
                                onClickExe={async () => {
                                    await firestore
                                        .collection(collections.users)
                                        .doc(uid)
                                        .update({
                                            groups: firebase.firestore.FieldValue.arrayRemove(
                                                selectedChat
                                            ),
                                        });
                                    await firestore
                                        .collection(collections.groups_register)
                                        .doc(selectedChat)
                                        .update({
                                            [feilds.group_members]:
                                                firebase.firestore.FieldValue.arrayRemove(uid),
                                            updatedAt:
                                                firebase.firestore.FieldValue.serverTimestamp(),
                                        });
                                    await firestore
                                        .collection(collections.groups_register)
                                        .doc(selectedChat)
                                        .collection(collections.messages)
                                        .add({
                                            type: "bubble",
                                            tag: "user_left",
                                            createdAt:
                                                firebase.firestore.FieldValue.serverTimestamp(),
                                            uid: uid,
                                            user_that_left: displayName,
                                        });
                                    toast.success(
                                        `You have successfully left ${groupDetails.group_name}!`
                                    );
                                    setSelectedChat("");
                                }}
                                sufIcon={<FaSignOutAlt />}
                            >
                                Leave Group
                            </OptionsDropDownItem>
                        </DropList>
                    </div>
                </div>
            )}
            {selectedChat ? (
                messages &&
                messages.map((message, index) =>
                    message.type === "message" ? (
                        <Message key={index} message={message} loaded={loaded} />
                    ) : (
                        <InfoBubble key={index} message={message} />
                    )
                )
            ) : (
                <h1 className="no-chat-selected">Select a Chat to see messages</h1>
            )}

            <div className="dummy" ref={dummy}></div>
            <MessagesModal
                props={{
                    editGroupModal,
                    setEditGroupModal,
                    addUsers,
                    setAddUsers,
                    groupInfoModal,
                    setGroupInfoModal,
                }}
            />
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
            gsap.fromTo(
                bubble.current,
                {
                    scale: 0.7,
                    opacity: 0,
                    y: 10,
                },
                { scale: 1, opacity: 1, y: 0, duration: 1, ease: "expo.out" }
            );
        }
    }, []);
    return (
        <div className="bubble" ref={bubble}>
            <div className="text">
                {!messageOwner && <div className="message_sender">{sender}</div>}
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{text}</p>
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
    let bubble;
    switch (message.tag) {
        case "group_created":
            bubble = `${messageOwner ? "You" : message.group_creator} created this group!`;
            break;
        case "invite_sent":
            bubble = `${messageOwner ? "You" : message.inviter} invited ${message.invitee_name}!`;
            break;
        case "user_left":
            bubble = `${messageOwner ? "You" : message.user_that_left} left the Group!`;
            break;
        case "user_joined":
            bubble = `${
                message.user_that_joined_id == uid ? "You" : message.user_that_joined_name
            } joined the Group!`;
            break;
        case "group_updated":
            bubble = `${
                message.admin_uid == uid ? "You" : message.admin
            } Updated the Group's Details!`;
            break;
        case "user_removed":
            bubble = `${message.admin_uid == uid ? "You" : message.admin} removed ${
                message.removed_user
            }`;
            break;
    }
    return <div className="info_bubble">{bubble}</div>;
}
