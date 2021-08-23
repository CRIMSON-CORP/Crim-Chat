import React from "react";
import ChatPannel from "./ChatPanel/ChatPannel";
import Tabs from "./Tabs/Tabs";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../utils/firebase";
import { MobileNav, UserContext } from "../../utils/Contexts";
function ChatRoom() {
    const [userAuth] = useAuthState(auth);
    const [mobileNav, setMobileNav] = useState(false);
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
            console.log(error);
        }
        return unsub;
    }, []);
    return (
        <div className="dashboard">
            <UserContext.Provider value={{ user, setUser }}>
                <MobileNav.Provider value={{ mobileNav, setMobileNav }}>
                    <Tabs />
                    <ChatPannel />
                </MobileNav.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default ChatRoom;
