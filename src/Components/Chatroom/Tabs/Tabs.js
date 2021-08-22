import Logo from "../../../utils/CustomComponents";
import GroupChat from "./GroupChat";
import User from "./User";

function Tabs({ user }) {
    return (
        <div className="tabs">
            <Logo fsize={24} />
            <User />
            <GroupChat />
        </div>
    );
}

export default Tabs;
