const searchInput = document.getElementById("search-users");
const foundUsersContainer = document.getElementById("found-users");
const chatListContainer = document.getElementById("chat-list");

function updateSearchState() {
    const query = searchInput?.value.trim() || "";
    const shouldShowFound = query.length > 0;

    if (foundUsersContainer) foundUsersContainer.classList.toggle("hidden", !shouldShowFound);
    if (chatListContainer) chatListContainer.classList.toggle("hidden", shouldShowFound);
}

export function initSearchUI() {
    if (searchInput) searchInput.addEventListener("input", updateSearchState);
}

export { updateSearchState };
