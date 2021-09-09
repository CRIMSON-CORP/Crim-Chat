import toast from "react-hot-toast";
import { auth, firestore, storage } from "./firebase";
import { collections } from "./FirebaseRefs";
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
    async function signOutProm(auth) {
        await UpdateUserOnlineStatus(auth.currentUser.uid, "Offline");
        await localStorage.removeItem("user");
        await localStorage.removeItem("crimchat_current_group");
        await auth.signOut();
        return null;
    }
    if (auth.currentUser) {
        try {
            toast.promise(signOutProm(auth), {
                loading: "Signing out...",
                success: "Signed out Successfully!",
                error: "An error occured while Signing out!",
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export async function UpdateUserOnlineStatus(uid, status) {
    try {
        return await firestore.collection(collections.users).doc(uid).update({
            onlineStatus: status,
        });
    } catch (err) {
        console.log(err);
    }
}

export async function AddUser(currentUser, username) {
    try {
        return await firestore
            .collection(collections.users)
            .doc(currentUser.uid)
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
    } catch (err) {
        console.log(err);
    }
}
