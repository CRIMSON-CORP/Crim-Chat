import { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MobileNav, ReplyContext, SelectedChatContext } from "../../../utils/Contexts";
import Options from "../Options";
import Form from "./Form";
import Messages from "./Messages";
import NoChat from "./NoChat";
import { AnimatePresence, motion } from 'framer-motion'
import { DESKTOP } from "../../../utils/utils";
function ChatPannel() {
    const [caret, setCaret] = useState(false);
    const { selectedChat } = useContext(SelectedChatContext);
    const [reply, setReply] = useState({ text: null, recipient: null, id: null });
    const { mobileNav } = useContext(MobileNav);
    useEffect(() => {
        setReply({ text: null, recipient: null, id: null });
    }, [selectedChat]);

    const MOBILE_NAV_OPENED = !DESKTOP && mobileNav
    return (
        <div className="main-pannel">
            <Options />
            <motion.div
                className="chat-pannel"
                animate={{
                    x: MOBILE_NAV_OPENED ? 270 : 0,
                    scale: MOBILE_NAV_OPENED ? 0.5 : 1
                }}
                transition={{
                    type: "tween",
                    x: {
                        delay: !MOBILE_NAV_OPENED ? 0.2 : 0,
                        duration: 0.4
                    },
                    scale: {
                        delay: MOBILE_NAV_OPENED ? 0.1 : 0,
                        duration: 0.4,
                    },
                }}>
                <ReplyContext.Provider value={{ reply, setReply }}>
                    {selectedChat ? <Messages setCaret={setCaret} /> : <NoChat />}
                    <AnimatePresence>
                        {
                            caret && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Caret /></motion.div>
                        }
                    </AnimatePresence>
                    <Form />
                </ReplyContext.Provider>
            </motion.div>
        </div>
    );
}

export default ChatPannel;
function Caret() {
    return (
        <motion.div
            className="caret"
            animate={{
                y: -20,

            }}
            transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: .4,
                type: "tween",
                ease: "backOut"
            }}
            onClick={() => {
                document.querySelector(".dummy").scrollIntoView({ behavior: "smooth" });
            }}
        >
            <MdKeyboardArrowDown size={30} style={{ marginTop: 4 }} />
        </motion.div>
    );
}
