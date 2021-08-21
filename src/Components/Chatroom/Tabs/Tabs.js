import GroupChat from "./GroupChat";
import User from "./User";

function Tabs({ user }) {
    return (
        <div className="tabs">
            <User />
            <GroupChat />
        </div>
    );
}

export default Tabs;
