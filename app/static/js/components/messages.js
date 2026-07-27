import { state } from "../state/store.js";

const messagesContainer = document.getElementById("chat");
const contextMenu = document.getElementById("contextMenu");
let _currentMessage = null;


export function renderMessages(messages) {
    messagesContainer.innerHTML = "";

    messages.forEach(addMessage);
}


export function addMessage(message) {
        const item = document.createElement("li");

        item.classList.add("message");

        const contentElement = document.createElement("p");
        contentElement.textContent = message.content;

        const timeElement = document.createElement("i");
        timeElement.classList.add("time");
        timeElement.textContent = formatTime(message.created_at);

        item.appendChild(contentElement);
        item.appendChild(timeElement);

        
        if (message.sender_id == state.currentUser.id) {
            item.dataset.outgoing = "true";
            
            if (message.is_read) {
                
            }
        }

        if (message.edited) {
            const edited = document.createElement("span");

            edited.textContent = "edited";

            item.appendChild(edited);
        }

        item.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            _currentMessage = message;

            if (!contextMenu) return;

            contextMenu.classList.remove("hidden");
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
        });

        messagesContainer.appendChild(item);
    }


if (contextMenu) {
    const editBtn = contextMenu.querySelector(".edit-button");
    const copyBtn = contextMenu.querySelector(".copy-button");
    const deleteBtn = contextMenu.querySelector(".delete-button");

    if (copyBtn) copyBtn.addEventListener("click", async () => {
        if (!_currentMessage) return;
        try {
            await navigator.clipboard.writeText(_currentMessage.content);
        } catch (e) {
            const ta = document.createElement("textarea");
            ta.value = _currentMessage.content;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        contextMenu.classList.add("hidden");
    });

    if (editBtn) editBtn.addEventListener("click", () => {
        if (!_currentMessage) return;
        const newText = prompt("Change message", _currentMessage.content);
        if (newText !== null) {
            showMessage("Edit message feature is not implemented yet.");
        }
        contextMenu.classList.add("hidden");
    });

    if (deleteBtn) deleteBtn.addEventListener("click", () => {
        if (!_currentMessage) return;
        showMessage("Delete message feature is not implemented yet.");
        contextMenu.classList.add("hidden");
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