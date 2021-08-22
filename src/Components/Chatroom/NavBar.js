import Logo from "../Logo";
import { auth } from "../../utils/firebase";
import { UpdateUserOnlineStatus } from "../Auth/AddUser";
function NavBar() {
    return (
        <div className="nav mb-20">
            <Logo fsize={24} />
            <SignOut />
        </div>
    );
}

export default NavBar;

function SignOut() {
    async function signOut() {
        await UpdateUserOnlineStatus(auth.currentUser.uid, "Offline");
        auth.currentUser && (await auth.signOut());
    }
    return (
        <button className="signout-btn btn btn-fill" onClick={signOut}>
            Sign Out
        </button>
    );
}
