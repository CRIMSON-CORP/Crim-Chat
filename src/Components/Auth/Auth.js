import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { CSSTransition } from "react-transition-group";
function Auth() {
    const [banner, setBanner] = useState(window.innerWidth >= 766 ? "both" : "with-banner");
    const [activePage, setActivePage] = useState("signup");

    useEffect(() => {
        window.innerWidth >= 766 ? setBanner("both") : setBanner("with-banner");
    }, [window.innerWidth]);
    return (
        <div className={`auth ${window.innerWidth >= 766 ? "split" : ""}`}>
            <CSSTransition
                in={banner === "with-banner" || banner === "both"}
                unmountOnExit
                timeout={500}
                classNames="signup-tab"
            >
                <div className="banner-wrapper" style={{ overflow: "hidden" }}>
                    <Banner ban={banner} set={setBanner} />
                </div>
            </CSSTransition>
            <CSSTransition
                in={banner === "without-banner" || banner === "both"}
                unmountOnExit
                timeout={500}
                classNames="signin-tab"
            >
                <div className="auth-wrapper">
                    <CSSTransition
                        in={activePage === "signup"}
                        unmountOnExit
                        timeout={500}
                        classNames="signup-tab"
                    >
                        <SignUp
                            setActivePage={() => {
                                setActivePage("signin");
                            }}
                        />
                    </CSSTransition>
                    <CSSTransition
                        in={activePage === "signin"}
                        unmountOnExit
                        timeout={500}
                        classNames="signin-tab"
                    >
                        <SignIn
                            setActivePage={() => {
                                setActivePage("signup");
                            }}
                        />
                    </CSSTransition>
                </div>
            </CSSTransition>
        </div>
    );
}

export default Auth;
