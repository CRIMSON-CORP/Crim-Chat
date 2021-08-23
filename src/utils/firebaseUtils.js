import firebase, { auth, firestore } from "./firebase";

export function UploadImage(image, path) {
    return async (resolve, reject) => {
        try {
            const StorageRef = firebase.storage().ref(path);
            await StorageRef.put(image);
            resolve(await StorageRef.getDownloadURL());
        } catch (err) {
            reject(err.message());
        }
    };
}

export async function signOut() {
    if (auth.currentUser) {
        await UpdateUserOnlineStatus(auth.currentUser.uid, "Offline");
        await auth.signOut();
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
