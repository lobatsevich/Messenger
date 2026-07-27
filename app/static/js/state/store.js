export const state = {
    currentUser: null,
    activeChat: null,
    socket: null,

    setUser(user) {
        this.currentUser = user;
    },

    setActiveChat(chatId) {
        this.activeChat = chatId;
    }
}