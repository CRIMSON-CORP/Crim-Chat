import React from "react";
import { firestore } from "../../../utils/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
function Messages() {
    const ref = firestore.collection("messages");
    const messageRef = ref.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(messageRef, { idField: "id" });
    return (
        <div>
            {messages &&
                messages.map((message, index) => <Message key={index} message={message} />)}
        </div>
    );
}
export default Messages;

function Message({ message }) {
    return <p>{message.text}</p>;
}
