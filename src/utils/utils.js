import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "./Contexts";

export const ImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

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
