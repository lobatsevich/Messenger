import { apiRequest } from "../api/client.js";
import { getChats } from "../api/chats.js";

async function loadProfile() {
    const user = await apiRequest(
        "/auth/me"
    );

    document.getElementById(
        "user-display-name"
    ).textContent = user.username;

    document.getElementById(
        "user-tag"
    ).textContent = `${user.tag}`;
}


async function loadChats() {
    const chats = await getChats();

    console.log(chats);
}


async function init() {
    const token = localStorage.getItem(
        "token"
    );

    if (!token) {
        window.location.replace("/auth");
        return;
    }

    try {
        await loadProfile();
        await loadChats();
    } catch(error) {
        console.error(error);

        localStorage.removeItem(
            "token"
        );

        window.location.replace("/auth");
    } 
}

init();