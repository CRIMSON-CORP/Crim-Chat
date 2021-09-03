import React, { useContext, useRef, useState, useEffect } from "react";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { auth, firestore, timeStamp } from "../../../utils/firebase";
function Form() {
    const [text, setText] = useState("");
    const { userlocal } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
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
            };
            await firestore
                .collection("groups-register")
                .doc(selectedChat)
                .collection("messages")
                .add(message);
            await firestore
                .collection("groups-register")
                .doc(selectedChat)
                .update({
                    updatedAt: time_stamp,
                    latestText: text.length < 30 ? text : text.substring(0, 30) + "...",
                });
            setText("");
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
                        <button className="submit btn btn-fill" disabled={text === ""}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Form;
