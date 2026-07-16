export async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...options.headers
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
        url,
        {
            ...options,
            headers
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Request error"
        );
    }

    return data;
}