import { apiRequest } from "./client.js";


export async function sendMessage(chatId, content) {
    return apiRequest(
        `/chats/${chatId}/messages`,
        {
            method: "POST",
            body: JSON.stringify({
                content
            })
        }
    );
}


export async function getMessages(chatId) {
    return apiRequest(
        `/chats/${chatId}/messages`
    );
}