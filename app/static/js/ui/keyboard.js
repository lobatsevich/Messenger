function initKeyboard() {
    const textarea = document.getElementById("message-input");
    if (!textarea) return;

    textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            const form = textarea.form || document.getElementById("send-message-form");
            if (form) form.requestSubmit();
        }
    });
}

export { initKeyboard };
