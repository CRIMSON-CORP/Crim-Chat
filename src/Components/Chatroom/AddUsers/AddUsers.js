import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput } from "../../../utils/CustomComponents";
import firebase, { firestore } from "../../../utils/firebase";
import { collections } from "../../../utils/FirebaseRefs";
import UsersList from "../CreateGroup/UsersList";

function AddUsers({ setmodal }) {
    const [selected, setSelected] = useState([]);
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const { selectedChat } = useContext(SelectedChatContext);
    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);
    async function fetchUsers() {
        await firestore
            .collection("users")
            .limit(10)
            .get()
            .then((usersList) => {
                setUsers(usersList.docs);
            });
    }
    useEffect(() => {
        fetchUsers();
    }, []);
    async function search(e) {
        const text = e.target.value.trim();
        setText(text);
        if (text == "") fetchUsers();
        const end = text.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
        try {
            const data = await firestore
                .collection("users")
                .where("displayName", ">=", text)
                .where("displayName", "<", end)
                .get();
            setUsers(data.docs);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="mt-2">
            <BorderedInput
                header="Invite Users"
                label="Search for Friends..."
                name="search_for_friends"
                onChange={search}
                value={text}
            />
            <h6 style={{ marginTop: 20 }}>{selected.length} Users Invited</h6>
            <UsersList users={users} selected={selected} setSelected={setSelected} />
            <button
                className="btn btn-fill"
                onClick={() => {
                    const notif_id = v4();
                    if (!selected.length) return toast.error("No user Selected!");
                    selected.forEach(async (user) => {
                        await firestore
                            .collection("users")
                            .doc(user)
                            .collection("notif")
                            .doc(notif_id)
                            .set({
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

                        toast.success("Invite Sent");
                        setmodal(false);
                    });
                }}
            >
                Add Users
            </button>
        </div>
    );
}

export default AddUsers;
