import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useState } from "react";
import { MobileNav } from "../../utils/Contexts";
function ChatRoom() {
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className="dashboard">
            <MobileNav.Provider value={{ mobileNav, setMobileNav }}>
                <Tabs />
                <ChatPannel />
            </MobileNav.Provider>
        </div>
    );
}

export default ChatRoom;
