const companionInfoContainer = document.getElementById("companion-info-container");

export function displayCompanionInfo(companion) {
    if (!companionInfoContainer) return;

    const header = document.getElementById("chat-header");
    if (header) {
        header.innerHTML = "";
        const img = document.createElement("img");
        img.id = "companion-avatar";
        img.src = companion.avatar || "";
        header.appendChild(img);

        const title = document.createElement("h2");
        title.id = "companion-name";
        title.textContent = companion.username || "";
        header.appendChild(title);

        const status = document.createElement("span");
        status.id = "companion-status-header";
        status.textContent = companion.status ? "В сети" : "";
        header.appendChild(status);
    }

    if (companionInfoContainer) {
        companionInfoContainer.innerHTML = `
            <img id="companion-avatar-large">
            <div class="companion-info">
                <p id="companion-status"></p>
                <p id="companion-username"></p>
                <p id="companion-tag"></p>
            </div>
        `;

        const largeImg = companionInfoContainer.querySelector("#companion-avatar-large");
        if (largeImg) largeImg.src = companion.avatar || "";
        const statusEl = companionInfoContainer.querySelector("#companion-status");
        if (statusEl) statusEl.textContent = companion.status || "";
        const usernameEl = companionInfoContainer.querySelector("#companion-username");
        if (usernameEl) usernameEl.textContent = companion.username || "";
        const tagEl = companionInfoContainer.querySelector("#companion-tag");
        if (tagEl) tagEl.textContent = companion.tag || "";
    }
}

export function displayChatHeader(chat) {
    const header = document.getElementById("chat-header");
    if (!header) return;

    header.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = chat && chat.is_group
        ? `Group ${chat.chat_id}`
        : `Chat ${chat.chat_id}`;

    header.appendChild(title);
}

