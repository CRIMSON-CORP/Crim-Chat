import Form from "./Form";
import Messages from "./Messages";

function ChatPannel() {
    return (
        <div className="chat-pannel">
            <Messages />
            <Form />
        </div>
    );
}

export default ChatPannel;
