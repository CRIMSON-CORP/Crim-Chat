import { useEffect, useState } from "react";
import { BorderedInput } from "../../../utils/CustomComponents";
import { firestore } from "../../../utils/firebase";
import UsersList from "./UsersList";

function InviteUsers({ selected, setSelected }) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        firestore
            .collection("users")
            .limit(10)
            .get()
            .then((usersList) => {
                setUsers(usersList.docs);
            });
    }, []);
    async function search(e) {
        const text = e.target.value.trim();
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
