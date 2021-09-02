import { createContext, useContext, useState } from "react";
import { MdClear } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import OnOutsiceClick from "react-outclick";
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

export function Loader() {
    return (
        <div className="loader-container">
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
                <CSSTransition
                    in={state}
                    unmountOnExit
                    classNames="modal-content-anim"
                    timeout={400}
                >
                    <div className={`modal-content-custom ${classTag} scroll`}>
                        <span
                            className="close"
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

export function ProfilePic({ img, d_n }) {
    return (
        <div className="profilePic">
            {img == null || img == undefined ? (
                <div className="alt">{d_n[0]}</div>
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
export function DropList({ open, closeComp, closeExe, children }) {
    return (
        <OnOutsiceClick onOutsideClick={closeExe}>
            {closeComp}
            <CSSTransition in={open} classNames="fade" unmountOnExit timeout={400}>
                <Close.Provider value={{ closeExe }}>
                    <OptionsDropDown close={closeExe}>{children}</OptionsDropDown>
                </Close.Provider>
            </CSSTransition>
        </OnOutsiceClick>
    );
}

export function OptionsDropDown({ children }) {
    return (
        <div className="options_dropdown">
            <ul>{children}</ul>
        </div>
    );
}

export function OptionsDropDownItem({ children, sufIcon, onClickExe }) {
    const { closeExe } = useContext(Close);
    return (
        <li
            className="dropDown_item"
            onClick={() => {
                onClickExe();
                closeExe();
            }}
        >
            {children} <div className="sufIcon">{sufIcon}</div>
        </li>
    );
}
