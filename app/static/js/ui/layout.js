import { showError } from "../utils/notifications.js";

const chatElement = document.getElementById('chat');
const companionInfoContainer = document.getElementById('companion-info-container');
const chatContainer = document.querySelector('.chat-container');

function setPageSize() {
    try {
        document.body.style.height = `${window.innerHeight}px`;
        if (chatElement) chatElement.style.height = `${window.innerHeight - 160}px`;
    } catch (e) {
        showError(e.message);
    }
}

function toggleCompanionInfoContainer() {
    if (!companionInfoContainer || !chatContainer) return;

    companionInfoContainer.classList.toggle('hidden-info');
    companionInfoContainer.classList.toggle('show-info');
    chatContainer.classList.toggle('compressed');
}

function initLayout() {
    setPageSize();
    window.addEventListener('resize', setPageSize);

    document.addEventListener('click', () => {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) contextMenu.classList.add('hidden');
    });

    const chatHeader = document.getElementById('chat-header');
    if (chatHeader) chatHeader.addEventListener('click', toggleCompanionInfoContainer);
}

export { initLayout, toggleCompanionInfoContainer };
