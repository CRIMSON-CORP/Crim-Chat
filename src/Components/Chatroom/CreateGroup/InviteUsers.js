import { useEffect, useState } from "react";
import { BorderedInput } from "../../../utils/CustomComponents";
import { fetchAllUsers, searchUser } from "../../../utils/firebaseUtils";
import UsersList from "./UsersList";

function InviteUsers({ selected, setSelected }) {
    const [users, setUsers] = useState([]);
    const fetchAll = async () => {
        setUsers(await fetchAllUsers());
    };
    useEffect(() => {
        fetchAll();
    }, []);
    return (
        <div>
            <BorderedInput
                header="Invite Users"
                label="Search for Friends..."
                name="search_for_friends"
                onChange={async (e) => {
                    setUsers(await searchUser(e.target.value.trim()));
                }}
                req={false}
            />
            <h6 style={{ marginTop: 20 }}>{selected.length} Users Invited</h6>
            <UsersList users={users} selected={selected} setSelected={setSelected} />
        </div>
    );
}

export default InviteUsers;
