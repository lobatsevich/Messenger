const dbUtilsMessages = require('../database/messages/db_utils');
const dbUtilsUsers = require('../database/users/db_utils');

function socketIORouter(io) {
    io.on('connection', (socket) => {
        const sender = socket.handshake.session.userLogin;
        console.log(`Пользователь ${sender} подключен`);
        const senderUserName = dbUtilsUsers.getUserName(sender);

        dbUtilsUsers.updateStatus(sender, 'online');
        socket.broadcast.emit('update_user_status');
        
        const profile = dbUtilsUsers.getUserProfile(sender);
        socket.emit('user-profile', profile);

        let receiver;

        socket.join(sender);

        updateChatList(sender, receiver, io);

        socket.on('set_room', (data) => {
            receiver = data.receiver;
            if (dbUtilsUsers.getUserName(receiver)) {
                const companionInfo = dbUtilsUsers.getCompanionInfo(receiver);
                socket.emit('companion_info', companionInfo);
                const chatList = dbUtilsMessages.getChatList(sender, dbUtilsUsers);
                socket.emit('chat_list', { chatList, receiver });
            } else {
                receiver = null;
            }
        });

        socket.on('typing', (data) => {

            io.to(receiver).emit('typing', { isTyping: data, sender });
        });

        socket.on('send_message', (data) => {
            if (!receiver) return;
            const { content } = data;

            const timestamp = new Date();
            const newMessage = { sender, receiver, content, timestamp };

            dbUtilsMessages.addMessage(newMessage);

            const renderMessage = {
                username: senderUserName,
                content,
                timestamp,
                sender,
            };

            socket.emit('display_message', {
                username: senderUserName,
                content,
                timestamp,
                sender,
                youreMessage: true
            });
            io.to(receiver).emit('send_message', renderMessage);

            updateChatList(sender, receiver, io);
        });

        socket.on('display_message', async (data) => {
            if (data.sender == receiver) {
                data.sender = dbUtilsUsers.getUserName(data.sender);
                socket.emit('display_message', data);
            }
        });

        socket.on('update_chat_list', async () => {
            updateChatList(sender, receiver, io);
        });

        socket.on('message_history', () => {
            const messages = dbUtilsMessages.getMessageHistory(
                sender,
                receiver,
            );
            
            messages.forEach((message) => {
                message.username = dbUtilsUsers.getUserName(message.sender);
                message.sender == sender ? message.youreMessage = true : null
            });
            socket.emit('message_history', { success: true, messages });
        });

        socket.on('companion_info', () => {
            if (receiver) {
                const companionInfo = dbUtilsUsers.getCompanionInfo(receiver);
                socket.emit('companion_info', companionInfo );
            }
        });
        
        socket.on('user-profile', () => {
            const profile = dbUtilsUsers.getUserProfile(sender);
            socket.emit('user-profile', profile);
        });

        socket.on('search_users', (data) => {
            const searchedUsersList = dbUtilsUsers.searchUsers({ 
                string: data, 
                sender 
            });
            socket.emit('search_users', searchedUsersList);
        });

        socket.on('copy_message', (data) => {
            const message = dbUtilsMessages.getMessageByTimestamp(data, sender, receiver);
            socket.emit('copy_message', message.content);
        });

        socket.on('delete_message', (data) => {
            dbUtilsMessages.deleteMessage(data, sender, receiver);
            socket.emit('delete_message');
            io.to(receiver).emit('delete_message');
        });

        socket.on('edit_message', (data) => {
            dbUtilsMessages.editMessage(data.timestamp, data.content, sender, receiver);
            const editedMessage = dbUtilsMessages.getMessageByTimestamp(
                data.timestamp,
                sender,
                receiver,
            );
            socket.emit('edit_message', {
                timestamp: data.timestamp,
                content: data.content,
            });
            io.to(receiver).emit('edit_message', editedMessage);
        });
        socket.on('disconnect', () => {
            console.log(`Пользователь ${sender} отключен`);
            const currentDate = new Date();
            dbUtilsUsers.updateStatus(sender, currentDate);
            socket.broadcast.emit('update_user_status');
        });
    });
}

function updateChatList(sender, receiver, io) {
    const chatList = dbUtilsMessages.getChatList(sender, dbUtilsUsers);
    io.to(sender).emit('chat_list', { chatList, receiver});
}

module.exports = socketIORouter;
