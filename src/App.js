import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./utils/firebase";
import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Chatroom/Dashboard";
import { LoaderContext, UserContext } from "./utils/Contexts";
import { Loader } from "./utils/CustomComponents";
import { CSSTransition } from "react-transition-group";
import { UpdateUserOnlineStatus } from "./utils/firebaseUtils";
import { collections } from "./utils/FirebaseRefs";
function App() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [userlocal, setUserLocal] = useState({
        profilePic: null,
        displayName: "",
        email: null,
        onlineStatus: null,
        groups: [],
    });

    useEffect(() => {
        if (user) {
            try {
                var unsub = firestore
                    .collection(collections.users)
                    .doc(user.uid)
                    .onSnapshot(
                        (userdb) => {
                            if (!userdb.exists) {
                                const local_user = JSON.parse(localStorage.getItem("user"));
                                local_user && setUserLocal(local_user);
                            } else {
                                setUserLocal(userdb.data());
                                localStorage.setItem("user", JSON.stringify(userdb.data()));
                            }
                        },
                        (error) => console.log(error)
                    );
            } catch (error) {
                console.log(error);
            }
        }
        return unsub;
    }, [user]);
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
            {user ? (
                <UserContext.Provider value={{ userlocal, setUserLocal }}>
                    <Dashboard />
                </UserContext.Provider>
            ) : (
                <Auth />
            )}
        </LoaderContext.Provider>
    );
}

export default App;
