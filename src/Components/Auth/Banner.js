import React from "react";
import Logo from "../Logo";
import chat_gif from "../../img/chat.gif";
function Banner() {
    return (
        <div className="banner">
            <div className="banner-wrapper">
                <Logo />
                <img src={chat_gif} alt="chat gif" />
            </div>
        </div>
    );
}

export default Banner;
