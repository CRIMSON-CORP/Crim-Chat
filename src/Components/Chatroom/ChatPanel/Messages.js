import React, { useContext, useEffect, useRef, useState } from "react";
import { firestore } from "../../../utils/firebase";
import { BiUser, BiUserPlus } from "react-icons/bi";
import gsap from "gsap";
import { ReplyContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { FaEllipsisH, FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { DropList, OptionsDropDownItem, useModal } from "../../../utils/CustomComponents";
import { collections } from "../../../utils/FirebaseRefs";
import { MdDeleteForever, MdInfoOutline } from "react-icons/md";
import $ from "jquery";
import MessagesModal from "./MessagesModal";
import aud from "../../../img/facebookchat.mp3";
import useSound from "use-sound";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { deleteGroup, leaveGroup } from "../../../utils/firebaseUtils";
import { FiEdit } from "react-icons/fi";
function Messages({ setCaret }) {
    const { selectedChat, setSelectedChat } = useContext(SelectedChatContext);
    const {
        userlocal: { uid, displayName },
    } = useContext(UserContext);
    const messageBoxRef = useRef();
    const [optionsToggle, setOptionsToggle] = useState(false);
    const [editGroupModal, setEditGroupModal] = useModal(false);
    const [addUsers, setAddUsers] = useState(false);
    const [groupInfoModal, setGroupInfoModal] = useModal(false);
    const [play] = useSound(aud);
    const [allowedToPlay, setAllowedToPlay] = useState(true);
    const groupDetailsRef = firestore.collection(collections.groups_register).doc(selectedChat);
    const groupMessagesRef = firestore
        .collection(collections.groups_register)
        .doc(selectedChat)
        .collection(collections.messages)
        .orderBy("createdAt")
        .limit(100);
    const [groupMessages] = useCollectionData(groupMessagesRef, { idField: "id" });
    const [groupDetails] = useDocumentData(groupDetailsRef, { idField: "group_id" });
    const [loaded, setLoaded] = useState(false);
    const dummy = document.querySelector(".dummy");
    useEffect(() => {
        if (groupMessages) {
            if (loaded) {
                dummy != undefined && dummy.scrollIntoView({ behavior: "smooth" });
                if (allowedToPlay) {
                    play();
                    setAllowedToPlay(false);
                }
                setTimeout(() => {
                    setAllowedToPlay(true);
                }, 1500);
            } else {
                dummy != undefined && dummy.scrollIntoView({ behavior: "auto" });
                setLoaded(true);
            }
        }
    }, [loaded, groupMessages]);

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
        return () => {
            setAllowedToPlay(false);
        };
    }, []);

    useEffect(() => {
        setLoaded(false);
    }, [selectedChat]);

    return (
        <>
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
                                    <img
                                        src={groupDetails.group_profilePic}
                                        width={45}
                                        height={45}
                                    />
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
                                {groupDetails.admins.includes(uid) && (
                                    <>
                                        <OptionsDropDownItem
                                            sufIcon={<FiEdit />}
                                            onClickExe={() => {
                                                setEditGroupModal(true);
                                            }}
                                        >
                                            Edit Group
                                        </OptionsDropDownItem>
                                        <OptionsDropDownItem
                                            sufIcon={<BiUserPlus />}
                                            onClickExe={() => {
                                                setAddUsers(true);
                                            }}
                                        >
                                            Add a new User
                                        </OptionsDropDownItem>
                                        <OptionsDropDownItem
                                            sufIcon={<MdDeleteForever />}
                                            onClickExe={async () => {
                                                const answer = confirm(
                                                    "Are you sure you want to delete the group? messages cannot be recovered!"
                                                );
                                                if (answer) {
                                                    await deleteGroup(
                                                        uid,
                                                        displayName,
                                                        selectedChat
                                                    );
                                                    setSelectedChat(null);
                                                } else return;
                                            }}
                                        >
                                            Delete Group
                                        </OptionsDropDownItem>
                                    </>
                                )}
                                <OptionsDropDownItem
                                    onClickExe={async () => {
                                        if (groupDetails.group_creator_id === uid) {
                                            return alert(
                                                "You are the Super Admin, make someone else the Super Admin before you leave"
                                            );
                                        }
                                        leaveGroup(
                                            uid,
                                            selectedChat,
                                            displayName,
                                            groupDetails.group_name
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
                {groupMessages !== undefined &&
                    groupMessages.map((message, index) =>
                        message.type === "message" ? (
                            <Message
                                key={message.id}
                                message={message}
                                id={message.id}
                                loaded={loaded}
                            />
                        ) : (
                            <InfoBubble key={index} message={message} />
                        )
                    )}

                <div className="dummy"></div>
            </div>
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
        </>
    );
}
export default Messages;

function Message({ message, loaded, id }) {
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
        <div
            ref={messageRef}
            className={`message ${messageOwner ? "sent" : "received"}`}
            data-id={id}
        >
            <div className="img_profile">
                {message.profilePhoto === null ? (
                    <BiUser size={22} />
                ) : (
                    <img src={message.profilePhoto} alt="profile" />
                )}
            </div>
            <Bubble message={message} id={id} messageOwner={messageOwner} loaded={loaded} />
        </div>
    );
}

function Bubble({
    message: { text, createdAt, sender, replyRecipient, replyMessage, replyMessage_id },
    messageOwner,
    loaded,
    id,
}) {
    const { setReply } = useContext(ReplyContext);
    const {
        userlocal: { displayName },
    } = useContext(UserContext);
    const time =
        createdAt !== null && createdAt !== undefined
            ? new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6).toLocaleTimeString()
            : "";

    const bubble = useRef();
    const textRef = useRef();
    useEffect(() => {
        if (loaded) {
            gsap.fromTo(
                bubble.current,
                {
                    scale: 0.3,
                    opacity: 0,
                    y: 10,
                    transformOrigin: messageOwner ? "70% 70%" : "20% 70%",
                },
                { scale: 1, opacity: 1, y: 0, duration: 1, ease: "expo.out" }
            );
        }
        bubble.current.addEventListener("dblclick", () => {
            setReply({
                text: text.length > 100 ? text.substring(0, 100) + "..." : text.substring(0, 100),
                recipient: sender.split(" ")[0],
                id,
            });
        });
    }, []);
    return (
        <div className="bubble" ref={bubble}>
            <div className="text">
                {replyMessage && (
                    <div
                        className="reply"
                        onClick={() => {
                            const target = document.querySelector(`[data-id="${replyMessage_id}"]`);
                            target &&
                                (target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                }),
                                target.classList.add("message_blink")),
                                setTimeout(() => {
                                    target.classList.remove("message_blink");
                                }, 3000);
                        }}
                    >
                        <span className="recipeint font-weight-bold trim">
                            {replyRecipient === displayName ? "You" : replyRecipient}
                        </span>
                        <p
                            className="reply_text font-italic trim-text"
                            style={{ whiteSpace: "pre" }}
                        >
                            {replyMessage}
                        </p>
                    </div>
                )}
                {!messageOwner && <div className="message_sender">{sender}</div>}
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{text}</p>
            </div>
            <div className="timestamp" ref={textRef}>
                {time}
            </div>
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
