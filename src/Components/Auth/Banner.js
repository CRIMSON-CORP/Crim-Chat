import React from "react";
import Logo from "../Logo";
import chat_gif from "../../img/chat.gif";
function Banner() {
    return (
        <div className="banner">
            <Logo />
            <img src={chat_gif} alt="chat gif" />
        </div>
    );
}

export default Banner;
