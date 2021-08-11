import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import Auth from "./Components/Auth/Auth";
import ChatRoom from "./Components/ChatRoom";
import { LoaderContext } from "./utils/Contexts";
import { Loader } from "./utils/CustomComponents";
import { CSSTransition } from "react-transition-group";
function App() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    return (
        <div>
            <LoaderContext.Provider value={{ loading, setLoading }}>
                {
                    <CSSTransition in={loading} classNames={"loading"} unmountOnExit timeout={400}>
                        <Loader />
                    </CSSTransition>
                }
                {user ? <ChatRoom /> : <Auth />}
            </LoaderContext.Provider>
        </div>
    );
}

export default App;
