import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import Auth from "./Components/Auth/Auth";
import ChatRoom from "./Components/ChatRoom";
function App() {
    const [user] = useAuthState(auth);
    return user ? <ChatRoom /> : <Auth />;
}

export default App;
