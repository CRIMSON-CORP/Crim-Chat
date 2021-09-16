import gsap, { Back } from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import OnOutsiceClick from "react-outclick";
import { CreateJoinContext } from "../../../utils/Contexts";
import { ReactComponent as Texting } from "../../../img/undraw_Texting_re_l11n.svg";
import { BiUser, BiUserPlus } from "react-icons/bi";

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
    const [tl, setTl] = useState();
    const sub0 = useRef();
    const sub1 = useRef();
    const sub2 = useRef();
    const sub3 = useRef();
    const { setJoinGroupModal, setCreateGroupModal, setEditProfileModal } =
        useContext(CreateJoinContext);

    useEffect(() => {
        const timeline = gsap.timeline({
            paused: true,
            reversed: true,
            defaults: { duration: 0.3 },
        });
        timeline
            .to(sub1.current, { y: -160, autoAlpha: 1, ease: Back.easeOut.config(2) }, "up")
            .to(sub2.current, { y: -80, autoAlpha: 1, ease: Back.easeOut.config(2) }, "up")
            .to(sub3.current, { y: -240, autoAlpha: 1, ease: Back.easeOut.config(2) }, "up")
            .to(sub0.current, { rotate: "315deg", ease: Back.easeOut.config(2) }, "up");
        setTl(timeline);
    }, []);
    return (
        <OnOutsiceClick
            onOutsideClick={() => {
                tl.reverse();
            }}
        >
            <div className="fab-wrapper">
                <div
                    className="fab ball join move"
                    onClick={() => {
                        setEditProfileModal(true);
                        tl.reverse();
                    }}
                    ref={sub3}
                    data-tooltip="Edit your Profile!"
                >
                    <BiUser />
                </div>
                <div
                    className="fab ball join move"
                    onClick={() => {
                        setJoinGroupModal(true);
                        tl.reverse();
                    }}
                    ref={sub1}
                    data-tooltip="Join a Group!"
                >
                    <BiUserPlus />
                </div>
                <div
                    className="fab ball create move"
                    onClick={() => {
                        setCreateGroupModal(true);
                        tl.reverse();
                    }}
                    ref={sub2}
                    data-tooltip="Creat your Group!"
                >
                    <FiEdit />
                </div>
                <div
                    className="fab ball static"
                    onClick={() => {
                        tl.reversed() ? tl.play() : tl.reverse();
                    }}
                >
                    <span ref={sub0} className="svg-wrapper">
                        <MdAdd />
                    </span>
                </div>
            </div>
        </OnOutsiceClick>
    );
}
