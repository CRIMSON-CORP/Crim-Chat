import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../../../utils/Contexts";
import firebase, { auth, firestore } from "../../../utils/firebase";
function Form({ dummy }) {
    const [text, setText] = useState("");
    const { user } = useContext(UserContext);
    const textarea = useRef();
    async function submit(e) {
        e.preventDefault();
        try {
            const message = {
                text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid: auth.currentUser.uid,
                profilePhoto: auth.currentUser.photoURL || user.profilePic,
                sender: user.displayName,
            };
            await firestore.collection("messages").add(message);
            dummy.current.scrollIntoView({ behavior: "smooth" });
            setText("");
        } catch (err) {
            console.log(err);
        }
    }
    function handleChange(txt) {
        textarea.current.style.height = "inherit";
        textarea.current.style.height = `${textarea.current.scrollHeight - 16}px`;

        setText(txt);
    }
    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
        return () => {
            setText("");
        };
    }, []);
    return (
        <div className="form">
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
                <button className="submit btn btn-fill">
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
    );
}

export default Form;
