import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useState } from "react";
import { MobileNav, SelectedChatContext } from "../../utils/Contexts";
import { UnderLay } from "../../utils/CustomComponents";
import { CSSTransition } from "react-transition-group";
function ChatRoom() {
    const [mobileNav, setMobileNav] = useState(false);
    const [selectedChat, setSelectedChat] = useState("");
    return (
        <div className="dashboard">
            <MobileNav.Provider value={{ mobileNav, setMobileNav }}>
                <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
                    <Tabs />
                    <CSSTransition in={mobileNav} unmountOnExit classNames="loading" timeout={400}>
                        <UnderLay
                            zIndex={80}
                            exe={() => {
                                setMobileNav(false);
                            }}
                        />
                    </CSSTransition>
                    <ChatPannel />
                </SelectedChatContext.Provider>
            </MobileNav.Provider>
        </div>
    );
}

export default ChatRoom;
