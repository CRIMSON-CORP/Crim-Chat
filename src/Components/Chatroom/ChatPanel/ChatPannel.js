import Form from "./Form";
import Messages from "./Messages";
import Options from "../Options";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import gsap from "gsap";
import { MdKeyboardArrowDown } from "react-icons/md";
function ChatPannel() {
    const [caret, setCaret] = useState(false);
    return (
        <div className="main-pannel">
            <Options />
            <div className="chat-pannel">
                <Messages setCaret={setCaret} />
                <CSSTransition in={caret} unmountOnExit classNames="fade_no_trans" timeout={400}>
                    <Caret />
                </CSSTransition>
                <Form />
            </div>
        </div>
    );
}

export default ChatPannel;
function Caret() {
    const caret = useRef();
    useEffect(() => {
        gsap.to(caret.current, { y: -20, yoyo: true, repeat: -1, ease: "back.out()" });
    }, []);
    return (
        <div
            ref={caret}
            className="caret"
            onClick={() => {
                document.querySelector(".dummy").scrollIntoView({ behavior: "smooth" });
            }}
        >
            <MdKeyboardArrowDown size={20} />
        </div>
    );
}
