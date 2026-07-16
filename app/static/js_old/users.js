const searchInput = document.getElementById('search-users');

searchInput.addEventListener('input', () => {
    const searchString = searchInput.value.trim();
    displayFoundUsersContainer(searchString.length > 0 ? true : false);
    if (searchString.length > 0) {
        socket.emit('search_users', searchString);
    }
});

function getClientProfile() {
    socket.emit('user-profile');
}

async function editProfile() {
    const form = document.getElementById('editProfileForm');
    const formData = new FormData(form);

    let response = await fetch('/edit-profile', {
        method: 'POST',
        body: formData,
    });
    responseObj = await response.json();
    if (responseObj.success) {
        getClientProfile();
    } else {
        console.error('Ошибка изменения профиля: ', responseTextObj.error);
    }
}