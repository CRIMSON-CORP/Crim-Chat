import { store } from "react-notifications-component";
import $ from "jquery";
export function Notification(type, title, message) {
    store.addNotification({
        title,
        message,
        type,
        container: "top-left",
        animationIn: ["animated", "jackInTheBox"],
        animationOut: ["animated", "bounceOut"],
        dismiss: {
            duration: 3000,
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
