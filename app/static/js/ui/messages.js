export function renderMessage(message) {
    const container = document.querySelector("#messages");

    const element = document.createElement("div");

    element.textContent = message.content;

    container.appendChild(element);
}