import { useContext, useEffect, useRef } from "react";
import { MobileNav } from "../../../utils/Contexts";
import Logo from "../../../utils/CustomComponents";
import GroupChat from "./GroupChat";
import User from "./User";
import gsap, { Expo } from "gsap";
function Tabs() {
    const { mobileNav } = useContext(MobileNav);
    const tab = useRef();
    useEffect(() => {
        if (window.innerWidth < 700) {
            if (mobileNav) {
                gsap.to(".chat-pannel", { x: 270 });
                gsap.to(".chat-pannel", { scale: 0.5, delay: 0.2, duration: 0.3 });
                gsap.to(tab.current, {
                    x: "0%",
                    duration: 0.25,
                    ease: Expo.easeOut(),
                });
            } else {
                gsap.to(".chat-pannel", { x: 0 });
                gsap.to(".chat-pannel", { scale: 1 });
                gsap.to(tab.current, {
                    x: "-100%",
                    duration: 0.25,
                });
            }
        }
    }, [mobileNav, window.innerWidth]);
    return (
        <div className="tabs" ref={tab}>
            <div className="tab_logo">
                <Logo fsize={24} />
            </div>
            <User />
            <GroupChat />
        </div>
    );
}

export default Tabs;
