import { useEffect, useState } from "react";
import { BorderedInput } from "../../../utils/CustomComponents";
import { firestore } from "../../../utils/firebase";
import UsersList from "./UsersList";

function InviteUsers({ selected, setSelected }) {
    const [users, setUsers] = useState([]);
    const fetchAll = async () => {
        await firestore
            .collection("users")
            .get()
            .then((usersList) => {
                setUsers(usersList.docs);
            });
    };
    useEffect(() => {
        fetchAll();
    }, []);
    async function search(e) {
        const text = e.target.value.trim();
        if (text == "") return fetchAll();
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
        <div>
            <BorderedInput
                header="Invite Users"
                label="Search for Friends..."
                name="search_for_friends"
                onChange={search}
                req={false}
            />
            <h6 style={{ marginTop: 20 }}>{selected.length} Users Invited</h6>
            <UsersList users={users} selected={selected} setSelected={setSelected} />
        </div>
    );
}

export default InviteUsers;
