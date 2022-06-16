import React, { useContext, useEffect } from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useState } from "react";
import {
    CreateJoinContext,
    MobileNav,
    SelectedChatContext,
    UserContext,
} from "../../utils/Contexts";
import { UnderLay, useModal } from "../../utils/CustomComponents";
import { AnimatePresence, motion } from "framer-motion";
import { DESKTOP } from "../../utils/utils";
function ChatRoom() {
    const [mobileNav, setMobileNav] = useState(false);
    const [selectedChat, setSelectedChat] = useState();
    const {
        userlocal: { mode },
    } = useContext(UserContext);
    const [joinGroupModal, setJoinGroupModal] = useModal();
    const [createGroupModal, setCreateGroupModal] = useModal();
    const [editProfileModal, setEditProfileModal] = useModal();

    useEffect(() => {
        const root = document.getElementById("root");
        mode == "dark"
            ? (root.classList.remove("light"), root.classList.add("dark"))
            : (root.classList.remove("dark"), root.classList.add("light"));
    }, [mode]);

    useEffect(() => {
        setSelectedChat(localStorage.getItem("crimchat_current_group"));
    }, []);

    return (
        <div className={`dashboard ${mode}`} style={{ gap: DESKTOP ? 20 : 0 }}>
            <MobileNav.Provider value={{ mobileNav, setMobileNav }}>
                <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
                    <Tabs />
                    <AnimatePresence>
                        {
                            mobileNav && <motion.div style={{ zIndex: 90 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .75 }}>
                                <UnderLay
                                    style={{ zIndex: 90 }}
                                    exe={() => {
                                        setMobileNav(false);
                                    }}
                                />
                            </motion.div>
                        }
                    </AnimatePresence>
                    <CreateJoinContext.Provider
                        value={{
                            joinGroupModal,
                            setJoinGroupModal,
                            createGroupModal,
                            setCreateGroupModal,
                            editProfileModal,
                            setEditProfileModal,
                        }}
                    >
                        <ChatPannel />
                    </CreateJoinContext.Provider>
                </SelectedChatContext.Provider>
            </MobileNav.Provider>
        </div>
    );
}

export default ChatRoom;
