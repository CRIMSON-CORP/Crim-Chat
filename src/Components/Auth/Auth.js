import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AnimatePresence, motion } from "framer-motion";

const transition = {
    duration: 0.75,
    type: "tween",
    ease: "easeOut",
};
const DESKTOP = window.innerWidth >= 766;
const SLIDE_IN_LEFT = {
    hidden: {
        x: "-100%",
        transition,
    },
    show: {
        x: 0,
        transition,
    },
};
const SLIDE_IN_RIGHT = {
    hidden: {
        x: "100%",
    },
    show: {
        x: 0,
    },
};

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
                        initial="show"
                        exit="hidden"
                        variants={SLIDE_IN_LEFT}
                        key="banner"
                        className="banner-wrapper"
                        style={{ overflow: "hidden" }}
                    >
                        <Banner ban={banner} set={setBanner} />
                    </motion.div>
                )}
                {(banner === "without-banner" || banner === "both") && (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={SLIDE_IN_RIGHT}
                        transition={{
                            when: "beforeChildren",
                            delay: 0.25,
                            ...transition,
                        }}
                        className="auth-wrapper"
                        key="auth-wrapper"
                    >
                        <AnimatePresence>
                            {activePage === "signin" && (
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    variants={SLIDE_IN_LEFT}
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
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    variants={SLIDE_IN_RIGHT}
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
