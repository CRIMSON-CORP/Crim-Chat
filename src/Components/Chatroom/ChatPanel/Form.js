import React, { useState } from "react";
import firebase, { auth, firestore } from "../../../utils/firebase";
function Form() {
    const [text, setText] = useState("");
    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        await firestore.collection("messages").add({
                            text,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            uid: auth.currentUser.uid,
                            profilePhoto: auth.currentUser.photoURL,
                        });
                        setText("");
                    } catch (err) {
                        console.log(err);
                    }
                }}
            >
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
                <button className="submit">Send</button>
            </form>
        </div>
    );
}

export default Form;
