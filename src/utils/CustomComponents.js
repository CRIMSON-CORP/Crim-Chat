import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MdClear, MdKeyboardArrowRight } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
import { FaUserFriends } from "react-icons/fa";
import gsap from "gsap";
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
    const modalRef = useRef();
    useEffect(() => {
        if (state) {
            gsap.fromTo(modalRef.current, { scale: 0.95 }, { scale: 1, duration: 0.5 });
        } else {
            gsap.fromTo(modalRef.current, { scale: 1 }, { scale: 0.95, duration: 0.5 });
        }
    }, [state]);
    return (
        <CSSTransition in={state} unmountOnExit classNames="modal-anim" timeout={400}>
            <div
                className="modal-custom"
                style={{ background: "#00000066" }}
                onClick={() => {
                    setmodal(false);
                }}
            >
                <div
                    className={`modal-content-custom ${classTag} scroll`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    ref={modalRef}
                    style={{ transform: "scale(0.95)" }}
                >
                    <span
                        className="close"
                        style={{ position: "sticky" }}
                        onClick={() => {
                            setmodal(false);
                        }}
                    >
                        <MdClear />
                    </span>
                    <div className="modal-content-custom-wrapper">
                        <div className="modal-head">
                            <h3>{header}</h3>
                        </div>
                        {children}
                    </div>
                </div>
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
                <span className="label trim-text">{label}</span>
            </div>
        </div>
    );
}

export function ProfilePic({ img, d_n, tag = "user" }) {
    return (
        <div className="profilePic">
            {!img ? (
                tag == "group" ? (
                    <div className="alt">
                        <FaUserFriends size="2em" />
                    </div>
                ) : (
                    <div className="alt">{d_n.trim()[0] && d_n.trim()[0].toUpperCase()}</div>
                )
            ) : (
                <img src={img} alt="profile" />
            )}
        </div>
    );
}

export function UnderLay({ exe, children, style }) {
    return (
        <div className="underlay" style={style} onMouseDown={exe} onClick={exe} onTouchStart={exe}>
            {children}
        </div>
    );
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
                        <span className={`indicator ${notifIndicator ? "show" : "hide"}`}>
                            {notifIndicator}
                        </span>
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

export function OptionsDropDown({ children, height, drop }) {
    return (
        <div
            ref={drop}
            className="options_dropdown scroll"
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
            <li
                className="dropDown_item_notif hover"
                onClick={() => {
                    setSelectedNotif(notif);
                    setActiveMenu(gotoMenu);
                }}
            >
                {notif.type == "invite" ? (
                    <>
                        <div>
                            <h5>New Invitation</h5>
                            <p>by {notif.sender}</p>
                        </div>
                        <MdKeyboardArrowRight />
                    </>
                ) : (
                    <>
                        <div>
                            <h5>New Notification</h5>
                            <p>{notif.message_header}</p>
                        </div>
                        <MdKeyboardArrowRight />
                    </>
                )}
            </li>
        </>
    );
}
