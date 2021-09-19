import React, { useContext, useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { ReplyContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { sendMessage } from "../../../utils/firebaseUtils";
function Form() {
    const [text, setText] = useState("");
    const { userlocal } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const { reply, setReply } = useContext(ReplyContext);
    const [loading, setLoading] = useState(false);
    const textarea = useRef();
    async function submit(e) {
        setLoading(true);
        setText("");
        setReply({ text: null, recipient: null, id: null });
        e.preventDefault();
        await sendMessage(text, userlocal, reply, selectedChat);
        textarea.current.style.height = "30px";
        setLoading(false);
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
                                <p
                                    className="reply_text font-italic"
                                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                                >
                                    {reply.text}
                                </p>
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
                            <button
                                className="submit btn btn-fill"
                                disabled={text.trim() === "" && !loading}
                            >
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
