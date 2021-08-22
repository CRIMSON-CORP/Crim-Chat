import { useState } from "react";
import { FaEllipsisH, FaSignOutAlt } from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
function Options() {
    const [optionsToggle, setOptionsToggle] = useState(false);
    return (
        <div className="optionsIcon">
            <div className="options_wrapper">
                <OnOutsiceClick
                    onOutsideClick={() => {
                        setOptionsToggle(false);
                    }}
                >
                    <FaEllipsisH
                        onClick={() => {
                            setOptionsToggle(!optionsToggle);
                        }}
                    />
                    <CSSTransition in={optionsToggle} classNames="fade" unmountOnExit timeout={400}>
                        <OptionsDropDown>
                            <OptionsDropDownItem sufIcon={<FaSignOutAlt />}>
                                Create Group
                            </OptionsDropDownItem>
                            <OptionsDropDownItem sufIcon={<FaSignOutAlt />}>
                                Sign out
                            </OptionsDropDownItem>
                        </OptionsDropDown>
                    </CSSTransition>
                </OnOutsiceClick>
            </div>
        </div>
    );
}

export default Options;

function OptionsDropDown({ children }) {
    return (
        <div className="options_dropdown">
            <ul>{children}</ul>
        </div>
    );
}

function OptionsDropDownItem({ children, sufIcon }) {
    return (
        <li className="dropDown_item">
            {children} <div className="sufIcon">{sufIcon}</div>
        </li>
    );
}
