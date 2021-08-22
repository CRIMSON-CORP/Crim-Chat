import { useRef } from "react";
import Form from "./Form";
import Messages from "./Messages";
import Options from "../Options";
function ChatPannel() {
    return (
        <div className="main-pannel">
            <Options />
            <div className="chat-pannel">
                <Messages />
                <Form />
            </div>
        </div>
    );
}

export default ChatPannel;
