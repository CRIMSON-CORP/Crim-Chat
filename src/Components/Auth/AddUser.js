import { firestore } from "../../utils/firebase";
export async function AddUser(currentUser, username) {
    try {
        const user = await firestore.collection("users").doc(`${currentUser.uid}`).get();
        if (!user.exists) {
            return await firestore
                .collection("users")
                .doc(`${currentUser.uid}`)
                .set({
                    displayName: username || currentUser.displayName,
                    profilePic: currentUser.photoURL,
                    email: currentUser.email,
                    onlineStatus: "Online",
                    uid: currentUser.uid,
                    typing: false,
                    groups: [],
                    chats: [],
                });
        } else return;
    } catch (err) {
        console.log(err);
    }
}

export async function UpdateUserOnlineStatus(uid, status) {
    try {
        return await firestore.collection("users").doc(`${uid}`).update({
            onlineStatus: status,
        });
    } catch (err) {
        console.log(err);
    }
}
