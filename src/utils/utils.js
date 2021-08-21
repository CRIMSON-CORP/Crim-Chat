import { store } from "react-notifications-component";
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
