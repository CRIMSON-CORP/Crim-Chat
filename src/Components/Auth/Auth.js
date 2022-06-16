import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AnimatePresence, motion } from "framer-motion";

const transition = {
    duration: 0.5,
    type: "tween",
    ease: "easeOut"
}
const X0 = { x: 0 }
const X100 = { x: "100%" }
const X_100 = { x: "-100%" }
const DESKTOP = window.innerWidth >= 766
function Auth() {
    const [banner, setBanner] = useState(DESKTOP ? "both" : "with-banner");
    const [activePage, setActivePage] = useState("signin");
    useEffect(() => {
        window.innerWidth >= 766 ? setBanner("both") : setBanner("with-banner");
    }, [window.innerWidth]);
    return (
        <div className={`auth ${DESKTOP ? "split" : ""}`}>
            <AnimatePresence>
                {(banner === "with-banner" || banner === "both") && (
                    <motion.div
                        initial={X0}
                        exit={X_100}
                        key="banner"
                        transition={transition}
                        className="banner-wrapper"
                        style={{ overflow: "hidden" }}
                    >
                        <Banner ban={banner} set={setBanner} />
                    </motion.div>
                )}
                {(banner === "without-banner" || banner === "both") && (
                    <motion.div
                        initial={X100}
                        animate={X0}
                        exit={X100}
                        transition={transition}
                        className="auth-wrapper"
                        key="auth-wrapper"
                    >
                        <AnimatePresence>
                            {activePage === "signin" && (
                                <motion.div
                                    initial={X_100}
                                    animate={X0}
                                    exit={X_100}
                                    transition={transition}
                                    className="signin"
                                    key="signin"
                                >
                                    <SignIn
                                        setActivePage={() => {
                                            setActivePage("signup");
                                        }}
                                    />
                                </motion.div>
                            )}
                            {activePage === "signup" && (
                                <motion.div
                                    initial={X100}
                                    animate={X0}
                                    exit={X100}
                                    transition={transition}
                                    className="signup"
                                    key="signup"
                                >
                                    <SignUp
                                        setActivePage={() => {
                                            setActivePage("signin");
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Auth;
