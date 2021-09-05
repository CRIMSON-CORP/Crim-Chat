import { createContext, useContext, useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { FaUserFriends } from "react-icons/fa";
import { UserContext } from "./Contexts";
export function InputForm({ preicon, type, suficon, name, onChange, value, plh, suficonAlt }) {
    const [pasVis, setPasVis] = useState(false);
    return (
        <div className="input_feild">
            {preicon}
            <input
                type={type !== "password" ? type : pasVis ? "text" : "password"}
                name={name}
                value={value}
                placeholder={plh}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                required={true}
            />
            <span onClick={() => setPasVis(!pasVis)}>{pasVis ? suficonAlt : suficon}</span>
        </div>
    );
}

export function Loader({ mode }) {
    return (
        <div className={`loader-container ${mode}`}>
            <div className="loader-wrapper">
                <span className="loader" style={{ "--i": 7 }}></span>
                <span className="loader" style={{ "--i": 6 }}></span>
                <span className="loader" style={{ "--i": 5 }}></span>
                <span className="loader" style={{ "--i": 4 }}></span>
                <span className="loader" style={{ "--i": 3 }}></span>
                <span className="loader" style={{ "--i": 2 }}></span>
                <span className="loader" style={{ "--i": 1 }}></span>
                <span className="loader" style={{ "--i": 1 }}></span>
                <span className="loader" style={{ "--i": 2 }}></span>
                <span className="loader" style={{ "--i": 3 }}></span>
                <span className="loader" style={{ "--i": 4 }}></span>
                <span className="loader" style={{ "--i": 5 }}></span>
                <span className="loader" style={{ "--i": 6 }}></span>
                <span className="loader" style={{ "--i": 7 }}></span>
            </div>
        </div>
    );
}

export function Logo({ fsize }) {
    return (
        <div className="logo" style={{ fontSize: fsize }}>
            <div className="logo_main">C</div>
            <div className="logo_text">Crim-Chat</div>
        </div>
    );
}

export default Logo;

export function useModal() {
    const [toggle, setToggle] = useState();

    function setModalState() {
        setToggle(!toggle);
    }

    return [toggle, setModalState];
}
export function Modal({ children, state, setmodal, classTag, header }) {
    return (
        <CSSTransition in={state} unmountOnExit classNames="modal-anim" timeout={400}>
            <div className="modal-custom">
                <div
                    className="underlay"
                    onClick={() => {
                        setmodal(false);
                    }}
                ></div>
                <CSSTransition in={state} unmountOnExit classNames="modal-content-anim" timeout={0}>
                    <div className={`modal-content-custom ${classTag} scroll`}>
                        <span
                            className="close"
                            style={{ position: "sticky" }}
                            onClick={() => {
                                setmodal(false);
                            }}
                        >
                            <MdClear />
                        </span>
                        <div className="modal-head">
                            <h3>{header}</h3>
                        </div>
                        {children}
                    </div>
                </CSSTransition>
            </div>
        </CSSTransition>
    );
}

export function ModalInput({ header, type, name, value, plh, onChange }) {
    return (
        <div className="modal_input_field">
            <h4>{header}</h4>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={plh}
                onChange={onChange}
                style={{ borderColor: `${value ? "#dc143c" : "grey"}` }}
            />
        </div>
    );
}

export function BorderedInput({ type = "text", label, value, onChange, name, header, req = true }) {
    const [valid, setValid] = useState(false);
    return (
        <div className="bordered_input_field">
            <h4>{header}</h4>
            <div className={`bordered_input_box ${valid && "valid"}`}>
                <input
                    name={name}
                    id={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onKeyUp={() => {
                        value == "" ? setValid(false) : setValid(true);
                    }}
                    required={req}
                    autoComplete={"off"}
                    onFocus={() => {
                        setValid(true);
                    }}
                    onBlur={() => {
                        !value && setValid(false);
                    }}
                />
                <span className="label">{label}</span>
            </div>
        </div>
    );
}

export function ProfilePic({ img, d_n, tag = "user" }) {
    return (
        <div className="profilePic">
            {img == null || img == undefined ? (
                tag == "group" ? (
                    <div className="alt">
                        <FaUserFriends size="2em" />
                    </div>
                ) : (
                    <div className="alt">{d_n[0]}</div>
                )
            ) : (
                <img src={img} alt="profile" />
            )}
        </div>
    );
}

export function UnderLay({ zIndex, exe }) {
    return <div className="underlay" style={{ zIndex }} onClick={exe}></div>;
}

const Close = createContext(null);
export function DropList({ open, closeComp, setter, children, height, tag, drop, notifIndicator }) {
    return (
        <div style={{ position: "relative" }}>
            <OnOutsiceClick
                onOutsideClick={() => {
                    setter(false);
                }}
            >
                <div
                    onClick={() => {
                        setter(!open);
                    }}
                >
                    {tag == "notif" && (
                        <span className={`indicator ${notifIndicator ? "show" : "hide"}`}></span>
                    )}
                    {closeComp}
                </div>
                <CSSTransition in={open} classNames="fade" unmountOnExit timeout={400}>
                    <Close.Provider value={{ setter }}>
                        <OptionsDropDown height={height} tag={tag} drop={drop}>
                            {children}
                        </OptionsDropDown>
                    </Close.Provider>
                </CSSTransition>
            </OnOutsiceClick>
        </div>
    );
}

export function OptionsDropDown({ children, height, tag, drop }) {
    return (
        <div
            ref={drop}
            className="options_dropdown"
            style={{
                overflowX: "hidden",
                height: height + "px",
            }}
        >
            <ul>{children}</ul>
        </div>
    );
}

export function OptionsDropDownItem({ children, sufIcon, onClickExe }) {
    const { setter } = useContext(Close);
    return (
        <li
            className="dropDown_item hover"
            onClick={() => {
                onClickExe();
                setter(false);
            }}
        >
            {children} <div className="sufIcon">{sufIcon}</div>
        </li>
    );
}

export function NotifDropDownItem({ notif, gotoMenu, setActiveMenu, setSelectedNotif }) {
    useEffect(() => {
        return setActiveMenu("main");
    }, []);
    return (
        <>
            {notif.type == "invite" ? (
                <li
                    className="dropDown_item_notif hover"
                    onClick={() => {
                        setSelectedNotif(notif);
                        setActiveMenu(gotoMenu);
                    }}
                >
                    <h5>New Invitation</h5>
                    <p>by {notif.sender}</p>
                </li>
            ) : (
                <li className="dropDown_item_notif" onClick={() => {}}>
                    <h5>{notif.header}</h5>
                    <p>New Notification</p>
                </li>
            )}
        </>
    );
}
