import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useState } from "react";
import { MobileNav, SelectedChatContext } from "../../utils/Contexts";
function ChatRoom() {
    const [mobileNav, setMobileNav] = useState(false);
    const [selectedChat, setSelectedChat] = useState({});
    return (
        <div className="dashboard">
            <MobileNav.Provider value={{ mobileNav, setMobileNav }}>
                <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
                    <Tabs />
                    <ChatPannel />
                </SelectedChatContext.Provider>
            </MobileNav.Provider>
        </div>
    );
}

export default ChatRoom;
