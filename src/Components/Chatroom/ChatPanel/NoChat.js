import { useContext, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import OnOutsiceClick from "react-outclick";
import { CreateJoinContext } from "../../../utils/Contexts";
import { ReactComponent as Texting } from "../../../img/undraw_Texting_re_l11n.svg";
import { BiUser, BiUserPlus } from "react-icons/bi";
import { useAnimation, motion } from "framer-motion";

function NoChat() {
    return (
        <>
            <div className="no-chat">
                <Texting className="no-chat-svg" />
                <div className="text  text-center">
                    Join an Open Group or Create yours and Invite Friends!
                </div>
            </div>
            <FAB />
        </>
    );
}

export default NoChat;

function FAB() {
    const sub0 = useAnimation();
    const sub1 = useAnimation();
    const sub2 = useAnimation();
    const sub3 = useAnimation();
    const tooltips_controls = useAnimation()
    const { setJoinGroupModal, setCreateGroupModal, setEditProfileModal } =
        useContext(CreateJoinContext);
    const [PopupOpened, setPopupOpened] = useState(false)

    function Popup() {
        sub0.start({
            rotate: "315deg"
        })
        sub1.start({
            y: -80,
            opacity: 1,
        })
        sub2.start({
            y: -160,
            opacity: 1,
        })
        sub3.start({
            y: -240,
            opacity: 1,
        })

        tooltips_controls.start({
            x: "-110%",
            y: 0,
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.5
            }
        })
        setPopupOpened(true)
    }

    function closePopup() {
        const reset = {
            y: 0,
            opacity: 0,
            transition: {
                delay: 0.5
            }
        }
        sub0.start({
            rotate: "0deg"
        })
        sub1.start(reset)
        sub2.start(reset)
        sub3.start(reset)

        tooltips_controls.start({
            x: "-110%",
            y: 10,
            scale: 0,
            opacity: 0
        })
        setPopupOpened(false)
    }
    return (
        <OnOutsiceClick
            onOutsideClick={() => {
                closePopup()
            }}
        >
            <div className="fab-wrapper">
                <motion.div
                    className="fab ball join move"
                    onClick={() => {
                        closePopup()
                        setEditProfileModal(true);
                    }}
                    animate={sub3}
                    data-tooltip="Edit your Profile!"
                >
                    <BiUser />
                    <motion.span animate={tooltips_controls} className="tooltip">Edit your Profile!</motion.span>
                </motion.div>

                <motion.div
                    className="fab ball create move"
                    onClick={() => {
                        closePopup()
                        setCreateGroupModal(true);
                    }}
                    animate={sub2}
                    data-tooltip="Creat your Group!"
                >
                    <FiEdit />
                    <motion.span animate={tooltips_controls} className="tooltip">Creat your Group!</motion.span>
                </motion.div>
                <motion.div
                    className="fab ball join move"
                    onClick={() => {
                        closePopup()
                        setJoinGroupModal(true);
                    }}
                    animate={sub1}
                    data-tooltip="Join a Group!"
                >
                    <BiUserPlus />
                    <motion.span animate={tooltips_controls} className="tooltip">Join a Group!</motion.span>
                </motion.div>
                <div
                    className="fab ball static"
                    onClick={() => {
                        PopupOpened ? closePopup() : Popup()
                    }}
                >
                    <motion.span animate={sub0} className="svg-wrapper">
                        <MdAdd />
                    </motion.span>
                </div>
            </div>
        </OnOutsiceClick>
    );
}
