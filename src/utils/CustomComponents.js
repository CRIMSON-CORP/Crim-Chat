import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
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
export function Modal({ children, state, setmodal }) {
    const modal = useRef();
    const modalContent = useRef();
    useEffect(() => {
        if (state) {
            // gsap.to(modal, { opacity: 1 }).to(modalContent, { y: 0 });
        }
    }, [state]);
    return (
        <CSSTransition in={state} unmountOnExit classNames="modal-anim" timeout={400}>
            <div className="modal-custom">
                <div className="underlay"></div>
                <div className="modal-content-custom">
                    <span className="close">
                        <MdClear
                            onClick={() => {
                                setmodal(false);
                            }}
                        />
                    </span>
                    {children}
                </div>
            </div>
        </CSSTransition>
    );
}
