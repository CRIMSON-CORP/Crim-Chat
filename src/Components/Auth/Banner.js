import React from "react";
import { Logo } from "../../utils/CustomComponents";
import chat_gif from "../../img/chat.gif";
function Banner({ set }) {
    return (
        <div className="banner">
            <div className="banner-container">
                <Logo />
                <img src={chat_gif} alt="chat gif" />
                {window.innerWidth <= 766 && (
                    <button
                        className="btn btn-fill"
                        onClick={() => {
                            set("without-banner");
                        }}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default Banner;
