import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import NavBar from "./NavBar";
import Tabs from "./Tabs/Tabs";
function ChatRoom() {
    return (
        <div className="dashboard">
            <NavBar />
            <div className="main-pannel">
                <Tabs />
                <ChatPannel />
            </div>
        </div>
    );
}

export default ChatRoom;
