import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Chatroom/Dashboard";
import { LoaderContext } from "./utils/Contexts";
import { Loader } from "./utils/CustomComponents";
import { CSSTransition } from "react-transition-group";
import { UpdateUserOnlineStatus } from "./utils/firebaseUtils";
function App() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        return async () => {
            auth.currentUser &&
                (await UpdateUserOnlineStatus(auth.currentUser.uid, "Offline"),
                await auth.signOut());
        };
    }, []);
    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {
                <CSSTransition in={loading} classNames={"loading"} unmountOnExit timeout={400}>
                    <Loader />
                </CSSTransition>
            }
            {user ? <Dashboard /> : <Auth />}
        </LoaderContext.Provider>
    );
}

export default App;
