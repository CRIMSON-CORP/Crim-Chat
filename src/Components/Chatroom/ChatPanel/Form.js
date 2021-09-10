import React, { useContext, useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { ReplyContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { auth, firestore, timeStamp } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";
function Form() {
    const [text, setText] = useState("");
    const { userlocal } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const { reply, setReply } = useContext(ReplyContext);
    const textarea = useRef();
    async function submit(e) {
        e.preventDefault();
        try {
            const time_stamp = timeStamp();
            const message = {
                text,
                createdAt: time_stamp,
                uid: auth.currentUser.uid,
                profilePhoto: auth.currentUser.photoURL || userlocal.profilePic,
                sender: userlocal.displayName,
                type: "message",
                replyMessage: reply.text ? reply.text.substring(0, 20) : null,
                replyRecipient: reply.recipient ? reply.recipient : null,
                replyMessage_id: reply.id,
            };
            await firestore
                .collection(collections.groups_register)
                .doc(selectedChat)
                .collection(collections.messages)
                .add(message);
            await firestore
                .collection(collections.groups_register)
                .doc(selectedChat)
                .update({
                    updatedAt: time_stamp,
                    latestText: text.length < 30 ? text : text.substring(0, 30) + "...",
                    latestText_sender_uid: userlocal.uid,
                    latestText_sender: userlocal.displayName.split(" ")[0],
                });
            setText("");
            setReply({ text: null, recipient: null, id: null });
            textarea.current.style.height = "30px";
        } catch (err) {
            console.log(err);
        }
    }
    function handleChange(txt) {
        textarea.current.style.height = "inherit";
        textarea.current.style.height = `${textarea.current.scrollHeight - 10}px`;

        setText(txt);
    }
    useEffect(() => {
        return () => {
            setText("");
        };
    }, []);

    return (
        <>
            {selectedChat && (
                <div className="form_input">
                    <CSSTransition
                        in={reply.text != null}
                        classNames="fade-trans"
                        timeout={100}
                        unmountOnExit
                    >
                        <div className="reply">
                            <MdClear
                                size={28}
                                onClick={() => {
                                    setReply({ text: null, recipient: null, id: null });
                                }}
                            />
                            <div>
                                <span className="recipeint font-weight-bold">
                                    {reply.recipient === userlocal.displayName.split(" ")[0]
                                        ? "You"
                                        : reply.recipient}
                                </span>
                                <p className="reply_text font-italic">{reply.text}</p>
                            </div>
                        </div>
                    </CSSTransition>
                    <form onSubmit={submit}>
                        <div className="text-wrapper">
                            <textarea
                                type="text"
                                placeholder="Type your message..."
                                value={text}
                                ref={textarea}
                                onChange={(e) => {
                                    handleChange(e.target.value);
                                }}
                            ></textarea>
                        </div>
                        <div
                            style={{
                                height: "100%",
                                alignItems: "center",
                                display: "grid",
                                padding: "2px",
                            }}
                        >
                            <button className="submit btn btn-fill" disabled={text.trim() === ""}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Form;
