const { time } = require('console');
const fs = require('fs');
const path = require('path');

const messagesPath = path.join(__dirname, 'messages.json');

function readMessagesDB() {
    try {
        const data = fs.readFileSync(messagesPath, 'utf-8');
        if (!data) {
        return { messages: {} };
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка загрузки базы данных: ', error.message);
        return { messages: {} };
    }
}

function saveMessagesDB(database) {
    try {
        fs.writeFileSync(messagesPath, JSON.stringify(database, null, 2), 'utf-8');
    } catch (error) {
        console.error('Ошибка сохранения базы данных: ', error.message);
    }
}

function getChatList(user, dbUtilsUsers) {
    const messages = readMessagesDB();
    const chatList = [];
  
    for (const key in messages) {
        const participants = key.split('&');
        
        if (participants.some(participant => participant === user)) {
            const companionLogin = participants.find(participant => participant !== user);
            const chatName = dbUtilsUsers.getUserName(companionLogin);
            const companionAvatar = dbUtilsUsers.getUserAvatar(companionLogin);
            const lastMessage = messages[key][messages[key].length - 1];
            const companionStatus = dbUtilsUsers.getUserStatus(companionLogin);

            const chat = {
                name: chatName,
                avatar: companionAvatar,
                companionLogin: companionLogin,
                lastMessage: lastMessage ? lastMessage.content : '',
                status: companionStatus,
                timestamp: lastMessage ? lastMessage.timestamp : ''
            };
            
            chatList.push(chat);
        }
    }

    return chatList;
}

function addMessage(message) {
    
    let messages = readMessagesDB();

    const chatKey = [message.sender, message.receiver].sort().join('&');

    messages[chatKey] = messages[chatKey] || [];
    messages[chatKey].push(message);

    saveMessagesDB(messages);
}

function deleteMessage(timestamp, sender, receiver) {
    let messages = readMessagesDB();
    const chatKey = [sender, receiver].sort().join('&');
    messages[chatKey] = messages[chatKey].filter(mess => mess.timestamp !== timestamp);

    saveMessagesDB(messages);
}

function getMessageHistory(sender, receiver) {
    const messages = readMessagesDB() || {};
    const chatKey = [sender, receiver].sort().join('&');
    const chatMessages = messages[chatKey] || [];

    return chatMessages;
}

function getMessageByTimestamp(timestamp, sender, receiver) {
    const messages = readMessagesDB();
    const chatKey = [sender, receiver].sort().join('&');
    const message = messages[chatKey].find(mess => mess.timestamp == timestamp);
    console.log(message);
    return message;
}

function editMessage(timestamp, content, sender, receiver) {
    const messages = readMessagesDB();
    const chatKey = [sender, receiver].sort().join('&');
    const message = getMessageByTimestamp(timestamp, sender, receiver);
    if (message.sender == sender) {
        message.content = content;
        message.edited = true;
        messages[chatKey] = messages[chatKey].map(mess => {
            return mess.timestamp == timestamp ? message : mess;
        });

        saveMessagesDB(messages);
    }
    return message;
}

module.exports = {
    readMessagesDB,
    addMessage,
    getMessageHistory,
    deleteMessage,
    getMessageByTimestamp,
    editMessage,
    getChatList,
};