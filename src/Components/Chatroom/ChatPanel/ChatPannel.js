import { useRef } from "react";
import Form from "./Form";
import Messages from "./Messages";
import Options from "../Options";
function ChatPannel() {
    const dummy = useRef();

    return (
        <div className="main-pannel">
            <Options />

            <div className="chat-pannel">
                <Messages dummy={dummy} />
                <Form dummy={dummy} />
            </div>
        </div>
    );
}

export default ChatPannel;
