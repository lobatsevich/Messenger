const chatList = document.getElementById("chat-list");


export function renderChatList(chats, onChatClick) {

    chatList.innerHTML = "";

    chats.forEach(chat => {
        const item = document.createElement("li");

        item.classList.add("chat-preview");


        const title = document.createElement("div");

        title.classList.add("chat-title");

        title.textContent = chat.is_group 
            ? `Group ${chat.chat_id}`
            : `Chat ${chat.chat_id}`;


        const preview = document.createElement("div");

        preview.classList.add(
            "chat-last-message"
        );

        preview.textContent =
            chat.last_message ?? "No messages";


        const time = document.createElement("div");

        time.classList.add(
            "chat-time"
        );

        if (chat.last_message_time) {
            time.textContent = formatTime(
                chat.last_message_time
            );
        }


        item.appendChild(title);
        item.appendChild(preview);
        item.appendChild(time);

        item.addEventListener(
            "click", 
            () => onChatClick(chat)
        );

        chatList.appendChild(item);
    });
}


function formatTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleTimeString(
        "ru-RU",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}