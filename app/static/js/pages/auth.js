import { login, register } from "../api/auth.js"
import { showError, showSuccess } from "../utils/notifications.js";

const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")

loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const loginValue = loginForm.elements.login.value;
        const password = loginForm.elements.password.value;

        try {
            await login(
                loginValue,
                password
            );

            window.location.replace("/");
        } catch (error) {
            showError(error.message);
        }
    }
);

registerForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const loginValue = registerForm.elements.login.value;
        const password = registerForm.elements.password.value;
        const username = registerForm.elements.username.value;
        const tag = registerForm.elements.tag.value;

        try {
            await register(
                loginValue,
                username,
                password,
                tag
            );

            showSuccess("Registration was successful");

        } catch (error) {
            showError(error.message);
        }
    }
);