import { useEffect, useState } from "react";
import chat_gif from "../../img/chat.gif";
import { Logo } from "../../utils/CustomComponents";
function Banner({ set }) {

    const [ShowNextBtn, setShowNextBtn] = useState(false)

    useEffect(() => {
        async function checkIfUser() {
            let local_user = await JSON.parse(localStorage.getItem("user"));
            if (local_user) return setShowNextBtn(false)
            setShowNextBtn(true)
        }
        checkIfUser()
    }, [])

    return (
        <div className="banner">
            <div className="banner-container">
                <Logo />
                <img src={chat_gif} alt="chat gif" />
                {window.innerWidth <= 766 && ShowNextBtn && (
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
