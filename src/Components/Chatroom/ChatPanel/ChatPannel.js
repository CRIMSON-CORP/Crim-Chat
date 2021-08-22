import { useEffect, useRef } from "react";
import Form from "./Form";
import Messages from "./Messages";

function ChatPannel() {
    const dummy = useRef();

    return (
        <div className="main-pannel">
            <div className="chat-pannel">
                <Messages dummy={dummy} />
                <Form dummy={dummy} />
            </div>
        </div>
    );
}

export default ChatPannel;
