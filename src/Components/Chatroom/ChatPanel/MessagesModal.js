import { Modal } from "../../../utils/CustomComponents";
import AddUsers from "../AddUsers/AddUsers";
import EditGroupUI from "../EditGroup/EditGroup";
import GroupInfoModal from "../GroupInfo/GroupInfoModal";

function MessagesModal({
    props: {
        editGroupModal,
        setEditGroupModal,
        addUsers,
        setAddUsers,
        groupInfoModal,
        setGroupInfoModal,
    },
}) {
    return (
        <>
            <Modal header="Edit Group Details" setmodal={setEditGroupModal} state={editGroupModal}>
                <EditGroupUI setmodal={setEditGroupModal} />
            </Modal>
            <Modal header="Add Users" setmodal={setAddUsers} state={addUsers}>
                <AddUsers setmodal={setAddUsers} />
            </Modal>
            <Modal
                header="Group Information"
                setmodal={setGroupInfoModal}
                state={groupInfoModal}
                classTag="group-info"
            >
                <GroupInfoModal setmodal={setGroupInfoModal} />
            </Modal>
        </>
    );
}

export default MessagesModal;
