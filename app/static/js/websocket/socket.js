import { state } from "../state/store.js";
import { handleEvent } from "./handlers.js";


export function connectSocket() {
    const token = localStorage.getItem("token");
    const protocol = location.protocol === "https:" ? "wss" : "ws";

    state.socket = new WebSocket(
        `${protocol}://${location.host}/ws?token=${token}`
    );

    state.socket.onopen = () => {
        console.log("WebSocket connected");
    };

    state.socket.onmessage = event => {
        const data = JSON.parse(event.data);

        handleEvent(data);
    };

    state.socket.onclose = () => {
        console.warn("WebSocket disconnected");
    };
}
