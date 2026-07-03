function sendMessage() {
    const content = document.getElementById('content').value;
    cleanedContent = cleanMessageWhitespace(content);
    !messageIsClear(cleanedContent)
        ? socket.emit('send_message', { content: cleanedContent })
        : console.error('Сообщение пустое');
    document.getElementById('content').value = '';
}

function displayMessage(message) {
    const messageHistoryContainer = document.getElementById('chat');
    const listItem = document.createElement('li');

    if (message.youreMessage) {
        listItem.dataset.youreMessage = true;
    }

    const contentElement = document.createElement('p');
    contentElement.textContent = cleanMessageWhitespace(message.content);

    const timeElement = document.createElement('i');
    timeElement.classList.add('time');
    timeElement.textContent = getHHMM(message.timestamp);

    listItem.appendChild(contentElement);
    listItem.appendChild(timeElement);

    if (message.edited) {
        listItem.classList.add('edited-message');
        const editMark = document.createElement('i');
        editMark.classList.add('edited');
        editMark.textContent = 'Изменено';
        listItem.appendChild(editMark);
    }

    listItem.dataset.timestamp = message.timestamp;

    listItem.addEventListener('contextmenu', function (event) {
        event.preventDefault();

        messageTimestamp = listItem.dataset.timestamp;
        
        noEditButton(listItem.dataset.youreMessage);
        
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.classList.remove('hidden');
    });

    messageHistoryContainer.appendChild(listItem);
}

function copyMessage() {
    if (messageTimestamp) {
        socket.emit('copy_message', messageTimestamp);
    }
}

function deleteMessage() {
    if (messageTimestamp) {
        socket.emit('delete_message', messageTimestamp);
    }
}

function editMessage() {
    const messageElement = document.querySelector(
        `li[data-timestamp="${messageTimestamp}"]`,
    );

    if (!messageElement.dataset.youreMessage) {
        return;
    }
    const messageContent = messageElement.querySelector('p');

    const currentText = messageContent.textContent;

    const textarea = document.createElement('textarea');
    textarea.value = currentText;

    textarea.style.height = `${messageContent.scrollHeight + 2}px`;
    messageContent.textContent = '';
    messageContent.appendChild(textarea);
    textarea.focus();

    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const textareaCleanValue = cleanMessageWhitespace(textarea.value);
            if (textareaCleanValue !== currentText) {
                newText = cleanMessageWhitespace(textarea.value);
                if (messageIsClear(newText)) {
                    deleteMessage();
                } else {
                    socket.emit('edit_message', {
                        timestamp: messageTimestamp,
                        content: newText,
                    });
                }
            } else {
                messageContent.textContent = currentText;
            }
        }
    });

    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
    });

    textarea.addEventListener('blur', () => {
        messageContent.textContent = currentText;
    });
}