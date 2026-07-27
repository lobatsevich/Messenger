import { apiRequest } from "../api/client.js";
import { getChats } from "../api/chats.js";
import { state } from "../state/store.js";
import { connectSocket } from "../websocket/socket.js";

import { renderChatList } from "../components/chatList.js";
import { renderMessages } from "../components/messages.js";
import { getMessages } from "../api/messages.js";
import { initMessageInput } from "../features/messageInput.js";
import { initUI, displayProfile, displayChatHeader } from "../ui/messenger.js";

async function loadProfile() {
    const user = await apiRequest(
        "/auth/me"
    );

    state.setUser(user);
    displayProfile(user);
}

async function loadChats() {
    const chats = await getChats();

    console.log(chats);

    renderChatList(chats, openChat);
}


async function openChat(chat) {
    state.setActiveChat(chat.chat_id);
    console.log('openChat called for', chat);
    displayChatHeader(chat);

    const messages = await getMessages(chat.chat_id);
    renderMessages(messages);
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
        initUI();
        connectSocket();
        await loadChats();
        initMessageInput();

    } catch(error) {
        console.error(error);

        localStorage.removeItem(
            "token"
        );

        window.location.replace("/auth");
    } 
}


init();