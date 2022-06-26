import { useContext, useRef } from "react";
import { MobileNav } from "../../../utils/Contexts";
import Logo from "../../../utils/CustomComponents";
import GroupChat from "./GroupChat";
import User from "./User";
import { motion } from "framer-motion"
import { DESKTOP } from "../../../utils/utils";

function Tabs() {
    const { mobileNav } = useContext(MobileNav);
    const tab = useRef();
    return (
        <motion.div
            className="tabs"
            ref={tab}
            initial={{ x: DESKTOP ? "0%" : "-100%" }}
            animate={{ x: DESKTOP || mobileNav ? "0%" : "-100%" }}
            transition={{ type: "tween" }}
        >
            <div className="tab_logo">
                <Logo fsize={24} />
            </div>
            <User />
            <GroupChat />
        </motion.div>
    );
}

export default Tabs;
