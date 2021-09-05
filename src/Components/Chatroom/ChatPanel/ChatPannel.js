import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import Options from "../Options";
import Form from "./Form";
import Messages from "./Messages";
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
            <MdKeyboardArrowDown size={30} style={{ marginTop: 4 }} />
        </div>
    );
}
