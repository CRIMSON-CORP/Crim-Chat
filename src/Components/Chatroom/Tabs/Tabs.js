import Logo from "../../Logo";
import GroupChat from "./GroupChat";
import User from "./User";

function Tabs() {
    return (
        <div className="tabs">
            <User />
            <GroupChat />
        </div>
    );
}

export default Tabs;
