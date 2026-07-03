const socket = io.connect(`${window.location.protocol}//${window.location.hostname}:2007`);

let activeReceiver = null;

socket.on('send_message', (data) => {
    socket.emit('display_message', data);
    socket.emit('update_chat_list');
})

socket.on('display_message', (data) => {
    displayMessage(data);
    scrollToBottom();
});

socket.on('message_history', (data) => {
    if (data.success) {
        displayMessageHistory(data.messages);
        scrollToBottom();
    }
});

socket.on('chat_list', (data) => {
    displayChatList(data.chatList, data.receiver);
});

socket.on('companion_info', (data) => {
    displayCompanionInfo(data);
});

socket.on('copy_message', (data) => {
    const textarea = document.createElement('textarea');
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
});

socket.on('delete_message', () => {
    socket.emit('message_history');
});

socket.on('edit_message', (data) => {
    const messageElement = document.querySelector(`li[data-timestamp="${data.timestamp}"]`);
    const messageContent = messageElement.querySelector('p');
    if (!messageElement.querySelector('.edited')) {
        messageElement.classList.add('edited-message');
        const editMark = document.createElement('i');
        editMark.classList.add('edited');
        editMark.textContent = 'Изменено';
        messageElement.appendChild(editMark);
    }

    messageContent.textContent = data.content;
});

socket.on('update_user_status', (data) => {
    socket.emit('update_chat_list');
    socket.emit('companion_info');
});

socket.on('typing', (data) => {
    const infoContainer = document.getElementById('chat-header');
    if (data.isTyping && data.sender == activeReceiver) {
        infoContainer.querySelector('#companion-status-header').textContent = 'Печатает';
        infoContainer.querySelector('#companion-status-header').classList.add('typing-text')
    } else {
        infoContainer.querySelector('#companion-status-header').classList.remove('typing-text')
        socket.emit('companion_info');
    }
});

socket.on('user-profile', (data) => {
    displayUserProfile(data);
});

socket.on('search_users', (data) => {
    displayFoundUsers(data);
});

function setRoom(receiver) {
    if (receiver) {
        activeReceiver = receiver;
        displayChat();
        socket.emit('set_room', { receiver });
        socket.emit('message_history');
    } else {
        console.error('Введите имя собеседника');
    }
}