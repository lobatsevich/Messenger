const chatContainer = document.querySelector('.chat-container');
const chat = document.getElementById('chat');
function setPageSize() {
    document.body.style.height = `${window.innerHeight}px`;
    chat.style.height = `${window.innerHeight-160}px`;
}

setPageSize();

window.addEventListener('resize', () => {
    setPageSize();
})

const inputMessageArea = document.getElementById('send-message-form');
const chatHeader = document.getElementById('chat-header');
const companionInfoContainer = document.getElementById('companion-info-container');

companionInfoContainer.classList.add('hidden-info');
companionInfoContainer.classList.add('hidden');
inputMessageArea.classList.add('hidden');
chatHeader.classList.add('hidden');

function displayChat() {
    inputMessageArea.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    companionInfoContainer.classList.remove('hidden');
}

chatHeader.addEventListener('click', () => {
    toggleCompanionInfoContainer();

});

function toggleCompanionInfoContainer() {
    companionInfoContainer.classList.toggle('hidden-info');
    companionInfoContainer.classList.toggle('show-info');
    chatContainer.classList.toggle('compressed');
}


const profile = document.querySelector('.profile-container');
const showProfileButton = document.getElementById('showProfile');

profile.classList.add('hidden');
showProfileButton.addEventListener('click', () => {
    profile.classList.toggle('hidden');
});

const avatarInput = document.getElementById('avatar');
avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];

    if (file) {
        const avatarPrewiew = document.getElementById('avatar-image-prewiew');
        avatarPrewiew.src = URL.createObjectURL(file);
    }
});

function toggleEditMode() {
    const editButton = document.getElementById('editButton');
    const profileInfo = document.getElementById('profile-info');
    const editProfileForm = document.getElementById('editProfileForm');

    editButton.textContent = editButton.textContent === 'Редактировать' ? 'Отмена' : 'Редактировать';
    editButton.classList.toggle('cancel');

    profileInfo.classList.toggle('hidden');
    editProfileForm.classList.toggle('hidden');
}

function displayFoundUsersContainer(display) {
    const foundUsers = document.getElementById("found-users");
    const chatList = document.getElementById("chat-list");
    display
        ? (foundUsers.classList.remove("hidden"), chatList.classList.add("hidden"))
        : (foundUsers.classList.add("hidden"), chatList.classList.remove("hidden"));
}

function noEditButton(youreMessage) {
    const contextMenu = document.getElementById('contextMenu');
    const editButton = contextMenu.querySelector('.edit-button');
    youreMessage 
        ? editButton.classList.remove('hidden')
        : editButton.classList.add('hidden');
}


