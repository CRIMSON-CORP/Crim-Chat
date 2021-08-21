import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import NavBar from "./NavBar";
import Tabs from "./Tabs/Tabs";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../utils/firebase";
import { UserContext } from "../../utils/Contexts";
function ChatRoom() {
    const [userAuth] = useAuthState(auth);
    const [user, setUser] = useState({
        profilePic: null,
        displayName: "",
        email: null,
        onlineStatus: null,
        groups: [],
    });
    useEffect(() => {
        try {
            var unsub = firestore
                .collection("users")
                .doc(`${userAuth.uid}`)
                .onSnapshot((user) => {
                    setUser(user.data());
                });
        } catch (error) {
            console.log(err);
        }
        return unsub;
    }, []);
    return (
        <div className="dashboard">
            <UserContext.Provider value={{ user, setUser }}>
                <NavBar />
                <div className="main-pannel">
                    <Tabs />
                    <ChatPannel />
                </div>
            </UserContext.Provider>
        </div>
    );
}

export default ChatRoom;
