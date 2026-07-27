import { apiRequest } from "./client.js";


export async function login(login, password) {
    const form = new URLSearchParams();

    form.append(
        "username",
        login
    );

    form.append(
        "password",
        password
    );

    const response = await fetch(
        "/auth/login",
        {
            method: "POST",
            body: form
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Login failed"
        );
    }


    localStorage.setItem(
        "token",
        data.access_token
    );

    return data;
}


export async function register(login, username, password, tag) {
    return apiRequest(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify({
                login,
                username,
                password,
                tag
            })  
        }
    );
}
