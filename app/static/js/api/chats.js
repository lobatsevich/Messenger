import { apiRequest } from "./client.js";


export async function getChats() {
    return apiRequest(
        "/chats"
    );
}