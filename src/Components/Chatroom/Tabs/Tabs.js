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
                gsap.to(tab.current, {
                    x: "0%",
                    opacity: 1,
                });
            } else {
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
