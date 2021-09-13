import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from "react-hot-toast";
import { CSSTransition } from "react-transition-group";
import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Chatroom/Dashboard";
import { LoaderContext, UserContext } from "./utils/Contexts";
import { Loader } from "./utils/CustomComponents";
import { auth, firestore } from "./utils/firebase";
import { collections } from "./utils/FirebaseRefs";
import { UpdateUserOnlineStatus } from "./utils/firebaseUtils";
import { useNavigatorOnLine } from "./utils/utils";
function App() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [userlocal, setUserLocal] = useState({
        profilePic: null,
        displayName: "",
        email: null,
        onlineStatus: null,
        groups: [],
        mode: "light",
    });

    const status = useNavigatorOnLine();
    useEffect(() => {
        if (user) {
            try {
                var unsub = firestore
                    .collection(collections.users)
                    .doc(user.uid)
                    .onSnapshot(
                        async (userdb) => {
                            if (!userdb.exists) {
                                let local_user = await JSON.parse(localStorage.getItem("user"));
                                if (local_user) {
                                    local_user.onlineStatus = status ? "Online" : "Offline";
                                    setUserLocal(local_user);
                                }
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

    useEffect(() => {
        setUserLocal((prev) => {
            return {
                ...prev,
                onlineStatus: status ? "Online" : "Offline",
            };
        });
    }, [status]);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {
                <CSSTransition in={loading} classNames="loading" unmountOnExit timeout={400}>
                    <Loader mode={userlocal.mode} />
                </CSSTransition>
            }
            {user ? (
                <UserContext.Provider value={{ userlocal, setUserLocal }}>
                    <Dashboard />
                </UserContext.Provider>
            ) : (
                <Auth />
            )}
            <Toaster />
        </LoaderContext.Provider>
    );
}

export default App;
