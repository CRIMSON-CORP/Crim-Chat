import Logo from "../Logo";
import { auth } from "../../utils/firebase";
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
    function signOut() {
        auth.currentUser && auth.signOut();
    }
    return (
        <button className="signout-btn btn btn-fill" onClick={signOut}>
            Sign Out
        </button>
    );
}
