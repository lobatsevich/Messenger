const profileInfo = document.getElementById("profile-info");
const editProfileForm = document.getElementById("editProfileForm");
const editButton = document.getElementById("editButton");
const saveProfileButton = document.getElementById("saveProfileButton");
const avatarInput = document.getElementById("avatar");

const DEFAULT_AVATAR = "/static/avatars/default-avatars/default-avatar-1.png";

export function displayProfile(user) {
    document.getElementById("user-display-name").textContent = user.username;
    document.getElementById("user-tag").textContent = `${user.tag}`;
    const avatar = user.avatar || DEFAULT_AVATAR;
    const avatarEl = document.getElementById("avatar-image");
    const avatarBtn = document.getElementById("avatar-image-button");
    if (avatarEl) avatarEl.src = avatar;
    if (avatarBtn) avatarBtn.src = avatar;

    const previewImage = document.getElementById("avatar-image-prewiew");
    if (previewImage) previewImage.src = avatar;

    const usernameInput = document.getElementById("username");
    const tagInput = document.getElementById("tag");
    if (usernameInput) usernameInput.value = user.username;
    if (tagInput) tagInput.value = user.tag;
}

function toggleEditMode() {
    if (!profileInfo || !editProfileForm || !editButton) return;

    profileInfo.classList.toggle("hidden");
    editProfileForm.classList.toggle("hidden");

    const editModeActive = !editProfileForm.classList.contains("hidden");
    editButton.textContent = editModeActive ? "Cancel" : "Edit Profile";
    editButton.classList.toggle("cancel", editModeActive);
}

function toggleProfilePanel() {
    const profileContainer = document.querySelector(".profile-container");
    if (!profileContainer) return;
    profileContainer.classList.toggle("hidden");
}

function updateAvatarPreview() {
    const file = avatarInput?.files?.[0];
    const previewImage = document.getElementById("avatar-image-prewiew");
    if (file && previewImage) previewImage.src = URL.createObjectURL(file);
}

export function initProfileUI() {
    const showProfileButton = document.getElementById("showProfile");
    if (showProfileButton) showProfileButton.addEventListener("click", toggleProfilePanel);

    if (editButton) editButton.addEventListener("click", toggleEditMode);
    if (saveProfileButton) saveProfileButton.addEventListener("click", toggleEditMode);
    if (avatarInput) avatarInput.addEventListener("change", updateAvatarPreview);
}

export { toggleEditMode };
