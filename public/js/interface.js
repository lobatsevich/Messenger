function displayCompanionInfo(companion) {
    const infoContainerHeader = document.getElementById('chat-header');
    infoContainerHeader.innerHTML = `
        <img id="companion-avatar" src='https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'>
        <h2 id="companion-name"></h2>
        <span id="companion-status-header"></span>
    `
    infoContainerHeader.querySelector('#companion-name').textContent = companion.username;
    infoContainerHeader.querySelector('#companion-avatar').src = companion.avatar;
    infoContainerHeader.querySelector('#companion-status-header').textContent = displayCompanionStatus(companion.status);

    const infoContainer = document.getElementById('companion-info-container');
    infoContainer.innerHTML = `
        <img id="companion-avatar">
        <div class="companion-info">
            <p id="companion-status"></p>
            <p id="companion-username"></p>
            <p id="companion-tag"></p>
        </div>
    `;
    infoContainer.querySelector('#companion-avatar').src = companion.avatar;
    infoContainer.querySelector('#companion-status').textContent = displayCompanionStatus(companion.status);
    infoContainer.querySelector('#companion-username').textContent = companion.username;
    infoContainer.querySelector('#companion-tag').textContent = companion.tag;
}

function displayMessageHistory(messages) {
    const messageHistoryContainer = document.getElementById('chat');
    messageHistoryContainer.innerHTML = '';

    messages.forEach(message => { 
        displayMessage(message)
    });
}

function displayChatList(chatList, receiver) {
    const chatListContainer = document.getElementById('chat-list');
    chatListContainer.textContent = '';

    if (chatList.length == 0) {
        const usersNotFound = document.createElement('h2');
        usersNotFound.textContent = "Тут пусто";
        chatListContainer.appendChild(usersNotFound);
        return;
    }

    chatList.sort((chatA, chatB) => 
        new Date(chatB.timestamp) - new Date(chatA.timestamp)
    );

    chatList.forEach(chat => {
        const listItem = document.createElement('li');
        listItem.classList.add('chat-list-item');

        const { name, status, avatar, companionLogin, lastMessage, timestamp } = chat;
        listItem.innerHTML = `
            <div class="avatar">
                <img>
                <span class="status"></span>
            </div>
            <div class="chat-info">
                <p class="username"></p>
                <p class="last-message"></p>
                <p class="timestamp"></p>
            </div>
        `;

        if (receiver == companionLogin) {
            listItem.classList.add('active-chat');
        }

        listItem.querySelector('.avatar img').src = avatar;
        listItem.querySelector('.username').textContent = name;
        listItem.querySelector('.last-message').textContent = lastMessage;
        listItem.querySelector('.timestamp').textContent = getTimestampFromChatList(timestamp);
        status == 'online'
            ? listItem.querySelector('.status').classList.remove('hidden')
            : listItem.querySelector('.status').classList.add('hidden');

        listItem.addEventListener('click', () => {
            setRoom(companionLogin);
        });

        chatListContainer.appendChild(listItem);
    });
}

const messageInputArea = document.getElementById('content');
messageInputArea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

const contextMenu = document.getElementById('contextMenu');
document.addEventListener('click', function() {
    contextMenu.classList.add('hidden');
});

function displayCompanionStatus(status) {
    if (status == 'online') {
        return 'В сети';
    } else {
        const currentDate = new Date();
        const statusDate = new Date(status);
        const timeDiff = currentDate - statusDate;
        const secondsDiff = Math.floor(timeDiff / 1000);
        const minutesDiff = Math.floor(secondsDiff / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);
    
        if (daysDiff === 0 && hoursDiff === 0 && minutesDiff < 1) {
            return 'Был(а) в сети только что';
        } else if (daysDiff === 0 && hoursDiff === 0 && minutesDiff < 60) {
            return `Был в сети ${minutesDiff} ${getMinutesWord(minutesDiff)} назад`;
        } else if (daysDiff === 1) {
            return `Был в сети вчера в ${getHHMM(statusDate)}`;
        } else if (daysDiff === 2) {
            return `Был в сети позавчера в ${getHHMM(statusDate)}`;
        } else if (daysDiff === 0 && hoursDiff < 12) {
            return `Был в сети ${hoursDiff} ${getHoursWord(hoursDiff)} назад`;
        }  else {
            const yearDisplay = 
                currentDate.getFullYear() !== statusDate.getFullYear() 
                ? ` ${statusDate.getFullYear()} года` 
                : '';

            return `Был в сети ${statusDate.getDate()} 
                ${getMonthName(statusDate.getMonth())}
                ${yearDisplay} в ${getHHMM(statusDate)}`;
        }
    }
}

function displayUserProfile(data) {
    document.getElementById('avatar-image').src = data.avatar;
    document.getElementById('avatar-image-button').src = data.avatar;
    document.getElementById('user-display-name').textContent = data.username;
    document.getElementById('user-tag').textContent = data.tag;

    document.getElementById('avatar-image-prewiew').src = data.avatar;
    document.getElementById('username').value = data.username;
    document.getElementById('tag').value = data.tag;
}

let isTyping = false;
messageInputArea.addEventListener('input', () => {
    if (!isTyping) {
        isTyping = true;
        socket.emit('typing', isTyping);
    }
});

messageInputArea.addEventListener('blur', () => {
    if (isTyping) {
        isTyping = false;
        socket.emit('typing', isTyping);
    }
});

function displayFoundUsers(users) {

    const foundUsersContainer = document.getElementById('found-users');
    foundUsersContainer.textContent = '';

    if (users.length == 0) {
        const usersNotFound = document.createElement('h2');
        usersNotFound.textContent = "Пользователь не найден";
        foundUsersContainer.appendChild(usersNotFound);
        return;
    }
    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.classList.add('found-users-item');

        const { username, tag, avatar, login} = user;
        listItem.innerHTML = `
            <div class="avatar">
                <img>
            </div>
            <div class="user-info">
                <p class="username"></p>
                <p class="tag"></p>
            </div>
        `;

        listItem.querySelector('.avatar img').src = avatar;
        listItem.querySelector('.username').textContent = username;
        listItem.querySelector('.tag').textContent = tag;

        listItem.addEventListener('click', () => {
            setRoom(login);
        });

        foundUsersContainer.appendChild(listItem);
    });
}

