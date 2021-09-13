import { useContext, useEffect, useState } from "react";
import { SelectedChatContext, UserContext } from "../../../utils/Contexts";
import { BorderedInput } from "../../../utils/CustomComponents";
import { addUserToGroup, fetchAllUsers, searchUser } from "../../../utils/firebaseUtils";
import UsersList from "../CreateGroup/UsersList";

function AddUsers({ setmodal }) {
    const [selected, setSelected] = useState([]);
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const { selectedChat } = useContext(SelectedChatContext);
    const {
        userlocal: { displayName, uid },
    } = useContext(UserContext);

    useEffect(() => {
        async function fetchCall() {
            return setUsers(await fetchAllUsers());
        }
        fetchCall();
    }, []);
    async function search(e) {
        const text = e.target.value.trim();
        setText(text);
        setUsers(await searchUser(text));
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
                className="btn btn-fill mt-4"
                onClick={() => {
                    addUserToGroup(uid, displayName, selectedChat, selected, setmodal);
                }}
            >
                Add Users
            </button>
        </div>
    );
}

export default AddUsers;
