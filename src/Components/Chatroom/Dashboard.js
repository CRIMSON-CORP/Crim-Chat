import React, { useContext, useEffect } from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useState } from "react";
import { MobileNav, SelectedChatContext, UserContext } from "../../utils/Contexts";
import { UnderLay } from "../../utils/CustomComponents";
import { CSSTransition } from "react-transition-group";
function ChatRoom() {
    const [mobileNav, setMobileNav] = useState(false);
    const [selectedChat, setSelectedChat] = useState("");
    const {
        userlocal: { mode },
    } = useContext(UserContext);

    useEffect(() => {
        const root = document.getElementById("root");
        mode == "dark"
            ? (root.classList.remove("light"), root.classList.add("dark"))
            : (root.classList.remove("dark"), root.classList.add("light"));
    }, [mode]);
    return (
        <div className={`dashboard ${mode}`}>
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
