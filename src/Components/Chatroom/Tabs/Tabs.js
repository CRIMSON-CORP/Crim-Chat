import { useContext, useEffect, useRef } from "react";
import { MobileNav } from "../../../utils/Contexts";
import Logo from "../../../utils/CustomComponents";
import GroupChat from "./GroupChat";
import User from "./User";
import gsap from "gsap";
import { MdClose } from "react-icons/md";
function Tabs() {
    const { mobileNav, setMobileNav } = useContext(MobileNav);
    const tab = useRef();
    useEffect(() => {
        if (window.innerWidth < 700) {
            if (mobileNav) {
                gsap.to(".chat-pannel", { x: 270 });
                gsap.to(".chat-pannel", { scale: 0.5, delay: 0.25, duration: 0.5 });
                gsap.to(tab.current, {
                    x: "0%",
                    opacity: 1,
                    duration: 0.5,
                });
            } else {
                gsap.to(".chat-pannel", { x: 0 });
                gsap.to(".chat-pannel", { scale: 1 });
                gsap.to(tab.current, {
                    x: "-100%",
                    opacity: 0,
                });
            }
        }
    }, [mobileNav]);
    return (
        <div className="tabs" ref={tab}>
            <div className="tab_logo">
                <Logo fsize={24} />
                <MdClose
                    size={20}
                    className="cancel"
                    onClick={() => {
                        setMobileNav(false);
                    }}
                />
            </div>
            <User />
            <GroupChat />
        </div>
    );
}

export default Tabs;
