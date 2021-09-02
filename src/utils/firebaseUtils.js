import { auth, firestore, storage } from "./firebase";
export async function UploadImage(image, path) {
    try {
        const StorageRef = storage.ref(path);
        await StorageRef.put(image);
        return await StorageRef.getDownloadURL();
    } catch (err) {
        return err;
    }
}

export async function signOut() {
    if (auth.currentUser) {
        try {
            await UpdateUserOnlineStatus(auth.currentUser.uid, "Offline");
            localStorage.removeItem("user");
            await auth.signOut();
            return null;
        } catch (err) {
            console.log(err);
        }
    }
}

export async function UpdateUserOnlineStatus(uid, status) {
    try {
        return await firestore.collection("users").doc(uid).update({
            onlineStatus: status,
        });
    } catch (err) {
        console.log(err);
    }
}

export async function AddUser(currentUser, username) {
    try {
        const user = await firestore.collection("users").doc(currentUser.uid).get();
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
                    notif: [],
                });
        } else return;
    } catch (err) {
        console.log(err);
    }
}
