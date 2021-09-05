import { store } from "react-notifications-component";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
export function Notification(type, title, message, duration) {
    store.addNotification({
        title,
        message,
        type,
        container: "top-right",
        animationIn: ["animated", "jackInTheBox"],
        animationOut: ["animated", "bounceOut"],
        dismiss: {
            duration: duration || 5000,
            onScreen: true,
            showIcon: true,
            touch: true,
            click: true,
        },
    });
}

export const ImageTypes = ["image/png", "image/jpg", "image/jpeg"];

export function Copy(message, item) {
    var temp = document.createElement("input");
    var body = document.querySelector("body");
    body.appendChild(temp);
    temp.value = document.querySelector(item).innerHTML;
    temp.select();
    document.execCommand("copy");
    body.removeChild(temp);
    Notification("success", "Copied", message);
}

const getOnLineStatus = () =>
    typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;

export const useNavigatorOnLine = () => {
    const [status, setStatus] = useState(getOnLineStatus());
    const warn = {
        w: false,
    };

    const setOnline = () => {
        setStatus(true);
        warn.w && toast.success("You're back Online!");
    };
    const setOffline = () => {
        setStatus(false);
        toast.error("You're Offline!");
        warn.w = true;
    };

    const CheckOnline = () => {
        if (navigator.onLine) {
            setOnline();
        } else {
            setOffline();
        }
    };

    useEffect(() => {
        window.addEventListener("load", CheckOnline);
        window.addEventListener("online", setOnline);
        window.addEventListener("offline", setOffline);

        return () => {
            window.removeEventListener("load", CheckOnline);
            window.removeEventListener("online", setOnline);
            window.removeEventListener("offline", setOffline);
        };
    }, []);

    return status;
};
