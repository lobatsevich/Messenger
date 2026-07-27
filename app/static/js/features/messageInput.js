import { state } from "../state/store.js";
import { sendMessage } from "../api/messages.js";
import { addMessage } from "../components/messages.js";
import { showError } from "../utils/notifications.js";

const form = document.getElementById("send-message-form");
const textarea = document.getElementById("message-input");

export function initMessageInput() {
    form.addEventListener(
        "submit",
        onSubmit
    );
}


async function onSubmit(event) {
    event.preventDefault();

    const content = textarea.value.trim();

    if (!content)
        return;

    if (!state.activeChat)
        return;

    try {
        const message = await sendMessage(
            state.activeChat,
            content
        );

        addMessage(message);

        textarea.value = "";
    } catch (error) {
        showError(error.message);
    }
}