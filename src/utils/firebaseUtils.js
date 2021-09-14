import toast from "react-hot-toast";
import firebase, { auth, firestore, storage, timeStamp } from "./firebase";
import { collections, feilds } from "./FirebaseRefs";
import { ImageTypes } from "./utils";
import { v4 } from "uuid";

export async function UploadImage(image, path, limit) {
    if (!image) return;
    if (image.size > limit)
        return toast.error(`Please select a picture less than ${limit / 1e6}mb`);
    if (!ImageTypes.includes(image.type)) return toast.error("Please select a picture");
    try {
        const StorageRef = storage.ref(path + v4());
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

export async function deleteAccount(uid) {
    await firestore.collection(collections.users).doc(uid).delete();
    await auth.currentUser.delete(uid).then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("crimchat_current_group");
        toast.success("Account Deleted!");
    });
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

export async function signup(username, email, password) {
    try {
        await auth.createUserWithEmailAndPassword(email.trim(), password);
        await AddUser(auth.currentUser, username.trim());
    } catch (err) {
        console.log(err);
        if (err.code === "auth/invalid-email") {
            toast.error(err.message);
        }
        if (err.code === "auth/email-already-in-use") {
            toast.error("Email already in use!");
        }
        if (err.code == "auth/network-request-failed") {
            toast.error("Network Error");
        }
        if (err.code == "auth/weak-password") {
            toast.error(err.message);
        }
    }
}

export async function signin(email, password, setEmail, setPassword) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        await UpdateUserOnlineStatus(auth.currentUser.uid, "Online");
        toast.success("Signed in Successfully!");
    } catch (err) {
        if (err.code === "auth/invalid-email") {
            toast.error(err.message);
        } else if (err.code === "auth/user-not-found") {
            toast.error("User with this Account does not Exist!");
        } else if (err.code == "auth/network-request-failed") {
            return toast.error("Network Error");
        } else if (err.code === "auth/wrong-password") {
            toast.error("The Password is incorrect for this User!");
            setPassword("");
        } else if (err.code === "auth/too-many-requests") {
            toast.error("Too many incorrect tries, Account Temporarily Blocked!");
            setEmail("");
            setPassword("");
        } else if (err.code === "auth/argument-error") {
            toast.error("Please fill in your email and password!");
        }
    }
}

export async function fetchAllUsers() {
    return await firestore
        .collection(collections.users)
        .get()
        .then((usersList) => usersList.docs);
}

export async function searchUser(text) {
    if (text == "") return fetchAllUsers();
    const end = text.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
    try {
        var data = await firestore
            .collection("users")
            .where("displayName", ">=", text)
            .where("displayName", "<", end)
            .get()
            .then((data) => data.docs);
    } catch (err) {
        console.log(err);
    }
    return data;
}

export async function addUserToGroup(uid, displayName, selectedChat, selected, setmodal) {
    const notif_id = v4();
    if (!selected.length) return toast.error("No user Selected!");
    selected.forEach(async (user) => {
        await firestore.collection("users").doc(user).collection("notif").doc(notif_id).set({
            notif_id: notif_id,
            sender: displayName,
            type: "invite",
            group_id: selectedChat,
            sender_id: uid,
        });
        // Adds Bubble for each invited user
        await firestore
            .collection(collections.groups_register)
            .doc(selectedChat)
            .collection("messages")
            .add({
                type: "bubble",
                createdAt: timeStamp(),
                uid: uid,
                tag: "invite_sent",
                invitee_id: user,
                invitee_name: await firestore
                    .collection(collections.users)
                    .doc(user)
                    .get()
                    .then((data) => data.data().displayName),
                inviter: displayName,
            });

        toast.success("Invite Sent");
        setmodal(false);
    });
}

export async function sendMessage(text, userlocal, reply, selectedChat) {
    try {
        const time_stamp = timeStamp();
        const message = {
            text,
            createdAt: time_stamp,
            uid: auth.currentUser.uid,
            profilePhoto: auth.currentUser.photoURL || userlocal.profilePic,
            sender: userlocal.displayName,
            type: "message",
            replyMessage: reply.text ? reply.text.substring(0, 20) : null,
            replyRecipient: reply.recipient ? reply.recipient : null,
            replyMessage_id: reply.id,
        };
        const replyMessage = reply.text && {
            replyMessage: reply.text.substring(0, 20),
            replyRecipient: reply.recipient,
            replyMessage_id: reply.id,
        };
        await firestore
            .collection(collections.groups_register)
            .doc(selectedChat)
            .collection(collections.messages)
            .add({ ...message, ...(replyMessage && replyMessage) });
        await firestore
            .collection(collections.groups_register)
            .doc(selectedChat)
            .update({
                updatedAt: time_stamp,
                latestText: text.length < 30 ? text : text.substring(0, 30) + "...",
                latestText_sender_uid: userlocal.uid,
                latestText_sender: userlocal.displayName.split(" ")[0],
            });
    } catch (err) {
        console.log(err);
    }
}

export async function leaveGroup(uid, selectedChat, displayName, groupName) {
    await firestore
        .collection(collections.users)
        .doc(uid)
        .update({
            groups: firebase.firestore.FieldValue.arrayRemove(selectedChat),
        });
    await firestore
        .collection(collections.groups_register)
        .doc(selectedChat)
        .update({
            [feilds.group_members]: firebase.firestore.FieldValue.arrayRemove(uid),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    await firestore
        .collection(collections.groups_register)
        .doc(selectedChat)
        .collection(collections.messages)
        .add({
            type: "bubble",
            tag: "user_left",
            createdAt: timeStamp(),
            uid: uid,
            user_that_left: displayName,
        });
    toast.success(`You have successfully left ${groupName}!`);
}

export async function createGroup(uid, displayName, groupDetails, selectedUsers) {
    try {
        const id = v4();
        const notifid = v4();
        const timestamp = timeStamp();
        await firestore
            .collection("groups-register")
            .doc(id)
            .set({
                group_createdAt: timestamp,
                group_description: groupDetails.descript,
                group_id: id,
                group_name: groupDetails.name,
                group_profilePic: groupDetails.profile_icon,
                group_members: [uid],
                group_security: groupDetails.closed,
                group_creator_id: uid,
                updatedAt: timestamp,
            });
        // Adds new group to user's list of groups
        await firestore
            .collection("users")
            .doc(uid)
            .update({
                groups: firebase.firestore.FieldValue.arrayUnion(id),
            });
        // Send Bubble that user has created the group
        await firestore
            .collection(collections.groups_register)
            .doc(id)
            .collection(collections.messages)
            .add({
                type: "bubble",
                tag: "group_created",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                group_creator: displayName,
                uid: uid,
            });
        if (selectedUsers.length !== 0) {
            selectedUsers.forEach(async (user) => {
                // Send notifications to added users
                await firestore.collection("users").doc(user).collection("notif").doc(notifid).set({
                    notif_id: notifid,
                    sender: displayName,
                    type: "invite",
                    group_id: id,
                    sender_id: uid,
                });
                // Adds Bubble for each invited user
                await firestore
                    .collection("groups-register")
                    .doc(id)
                    .collection("messages")
                    .add({
                        type: "bubble",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        uid: uid,
                        tag: "invite_sent",
                        invitee_id: user,
                        invitee_name: await firestore
                            .collection(collections.users)
                            .doc(user)
                            .get()
                            .then((data) => data.data().displayName),
                        inviter: displayName,
                    });
            });
        }
        return id;
    } catch (error) {
        console.log(error);
    }
}

export async function updateGroup(uid, displayName, selectedChat, groupDetails) {
    //updates group details
    await firestore.collection(collections.groups_register).doc(selectedChat).update(groupDetails);

    // Send Bubble that user has updated the group
    await firestore
        .collection(collections.groups_register)
        .doc(selectedChat)
        .collection(collections.messages)
        .add({
            type: "bubble",
            tag: "group_updated",
            admin: displayName,
            admin_uid: uid,
            createdAt: timeStamp(),
        });
    toast.success("Group Details updated successfully");
}
