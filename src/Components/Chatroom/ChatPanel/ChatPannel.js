import gsap, { Back } from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { ReplyContext, SelectedChatContext } from "../../../utils/Contexts";
import Options from "../Options";
import Form from "./Form";
import Messages from "./Messages";
import NoChat from "./NoChat";
function ChatPannel() {
    const [caret, setCaret] = useState(false);
    const { selectedChat } = useContext(SelectedChatContext);
    const [reply, setReply] = useState({ text: null, recipient: null, id: null });
    useEffect(() => {
        setReply({ text: null, recipient: null, id: null });
    }, [selectedChat]);
    return (
        <div className="main-pannel">
            <Options />
            <div className="chat-pannel">
                <ReplyContext.Provider value={{ reply, setReply }}>
                    {selectedChat ? <Messages setCaret={setCaret} /> : <NoChat />}
                    <CSSTransition
                        in={caret}
                        unmountOnExit
                        classNames="fade_no_trans"
                        timeout={400}
                    >
                        <Caret />
                    </CSSTransition>
                    <Form />
                </ReplyContext.Provider>
            </div>
        </div>
    );
}

export default ChatPannel;
function Caret() {
    const caret = useRef();
    useEffect(() => {
        gsap.to(caret.current, {
            y: -20,
            yoyo: true,
            repeat: -1,
            ease: Back.easeOut.config(2),
        });
    }, []);
    return (
        <div
            ref={caret}
            className="caret"
            onClick={() => {
                document.querySelector(".dummy").scrollIntoView({ behavior: "smooth" });
            }}
        >
            <MdKeyboardArrowDown size={30} style={{ marginTop: 4 }} />
        </div>
    );
}
