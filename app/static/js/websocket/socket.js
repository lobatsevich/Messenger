import { state } from "../state/store.js";
import { handleEvent } from "./handlers.js";


export function connectSocket() {
    const token = localStorage.getItem("token");

    state.socket = new WebSocket(
        `ws://${location.host}/ws?token=${token}`
    );

    state.socket.onmessage = event => {
        const data = JSON.parse(event.data);

        handleEvent(data);
    }
}