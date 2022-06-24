import React, { useContext, useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import { BiImage } from "react-icons/bi";
import { ReplyContext, SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { sendMessage } from "../../../utils/firebaseUtils";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { AnimatePresence, motion } from "framer-motion";
function Form() {
    const [text, setText] = useState("");
    const { userlocal } = useContext(UserContext);
    const { selectedChat } = useContext(SelectedChatContext);
    const { reply, setReply } = useContext(ReplyContext);
    const [loading, setLoading] = useState(false);
    const [readyImage, setReadyImage] = useState(false);
    const [Image, setImage] = useState([]);
    const textarea = useRef();
    registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    );
    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setText("");
        setReply({ text: null, recipient: null, id: null });
        setImage([]);
        setReadyImage(false);
        await sendMessage(text, userlocal, reply, Image[0], selectedChat);
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
                <div className="form_input" style={{ overflow: "hidden" }}>
                    <AnimatePresence>
                        {reply.text != null && (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                transition={{
                                    type: "tween",
                                }}
                                className="reply"
                                key="reply"
                            >
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {readyImage && (
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                exit={{ y: 100 }}
                                transition={{
                                    type: "tween",
                                }}
                                key="file"
                                style={{ overflow: "hidden" }}
                            >
                                <FilePond
                                    allowMultiple={false}
                                    allowFileTypeValidation={true}
                                    allowFileSizeValidation={true}
                                    maxFileSize={"2MB"}
                                    labelMaxFileSizeExceeded={"Image is too large!"}
                                    files={Image}
                                    maxFiles={1}
                                    acceptedFileTypes={["image/*"]}
                                    onaddfile={(err, file) => !err && setImage([file])}
                                    onremovefile={() => setImage([])}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                onFocus={() => {
                                    document
                                        .querySelector(".dummy")
                                        .scrollIntoView({ behavior: "smooth" });
                                }}
                            ></textarea>
                            <div
                                className={`image_icon ${readyImage ? "open" : ""}`}
                                onClick={() => {
                                    setReadyImage(!readyImage);
                                }}
                            >
                                <BiImage />
                            </div>
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
                                disabled={text.trim() === "" && !loading && Image.length === 0}
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
