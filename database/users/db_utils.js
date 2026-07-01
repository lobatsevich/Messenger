const fs = require('fs');
const path = require('path');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const usersPath = path.join(__dirname, 'users.json');

function readUsersDB() {
    try {
        const data = fs.readFileSync(usersPath, 'utf-8');
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Ошибка чтения базы данных пользователей: ', error.message);
        return [];
    }
}

function saveUsersDB(users) {
    try {
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Ошибка сохранения базы данных пользователей: ', error.message);
    }
}

function isLoginPasswordValid(login, password) {
    const loginArr = String(login).split('');
    const passwordArr = String(password).split('');
    if (loginArr.length > 16 || loginArr.length < 4) {
        return { success: false, error: "Длина логина должна составлять от 4 до 16 символов" };
    }
    
    if (passwordArr.length > 20 || passwordArr.length < 4) {
        return { success: false, error: "Длина пароля должна составлять от 4 до 20 символов" };
    }

    const loginValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
    loginArr.forEach(loginChar => {
        if (!loginValidChars.includes(loginChar)) {
            return { success: false, error: "Введите корректные данные" };
        }
    })

    return { success: true };
}

function isUsernameValid(username) {
    const usernameArr = String(username).split('');
    if (usernameArr.length > 24 || usernameArr.length < 2) {
        return { success: false, error: "Длина имени пользователя должна составлять от 2 до 24 символов" }
    }

    return { success: true };
}

function isTagValid(tag) {
    const tagArr = String(tag).split('');
    if (tagArr.length > 22 || tagArr.length < 2) {
        return { success: false, error: "Длина тега должна составлять от 4 до 20 символов" }
    }
    
    const tagValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_.#$%?!*-+=';
    tagArr.forEach(tagChar => {
        if (!tagValidChars.includes(tagChar)) {
            return { success: false, error: "Введите корректные данные" };
        }
    })
    
    return { success: true };
}

function registerUser(login, password, username) {
    const users = readUsersDB();
    loginClean = login.split(' ').join('').split('\n').join('');
    passwordClean = password.split(' ').join('').split('\n').join('');

    const loginPasswordValid = isLoginPasswordValid(loginClean, passwordClean);
    if (!loginPasswordValid.success) {
        return loginPasswordValid;
    }
    
    if (users.find(user => user.login === loginClean.toLowerCase())) {
        return { 
            success: false, 
            error: 'Пользователь с таким логином уже зарегистрирован' 
        };
    }

    const newUser = { 
        login: loginClean, 
        password: passwordClean, 
        username, 
        tag: login, 
        avatar: `avatars/default-avatars/default-avatar-${getRandomInt(1, 24)}.png` 
    };
    users.push(newUser);

    saveUsersDB(users);
    return { 
        success: true, 
        user: newUser
    };
}

function loginUser(login, password) {
    loginClean = login.split(' ').join('').split('\n').join('');
    passwordClean = password.split(' ').join('').split('\n').join('');

    const loginPasswordValid = isLoginPasswordValid(loginClean, passwordClean);
    if (!loginPasswordValid.success) {
        return loginPasswordValid;
    }

    const users = readUsersDB();
    const user = users.find(
        (user) =>
            user.login === loginClean && user.password === passwordClean,
    );

    return user
        ? {
              success: true,
              user,
          }
        : {
              success: false,
              error: "Неверное имя пользователя или пароль",
          };
}

function getUserName(login) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    return user ? user.username : null;
}

function getUserAvatar(login) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    return user ? user.avatar : null;
}

function getUserStatus(login) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    return user ? user.status : null;
}

function getUserProfile(login) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    return user ? {
        username: user.username,
        tag: user.tag,
        avatar: user.avatar
    } : null;
}

function getCompanionInfo(companionLogin) {
    const users = readUsersDB();
    const user = users.find(user => user.login === companionLogin);
    delete user.password;
    delete user.login;
    return user ? user : null;
}

function isTagUnique(login, tag) {
    const users = readUsersDB();
    const user = users.find(user => user.tag === tag);
    return user ? user.login === login : true;
}

function updateStatus(login, time) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);

    if (user) {
        user.status = time;

        saveUsersDB(users);
        return { success: true, user };
    } else {
        return { success: false, error: 'Пользователь не найден' };
    }
}

function searchUsers(data) {
    const users = readUsersDB();
    const lowerCaseString = data.string.toLowerCase();
    
    let filteredUsers;

    if (data.string[0] == '@') {
        filteredUsers = users.filter((user) =>
            user.tag.toLowerCase().startsWith(lowerCaseString.substring(1)) 
            && user.login != data.sender
        );
    } else {
        filteredUsers = users.filter((user) =>
            user.username.toLowerCase().startsWith(lowerCaseString)
        );
    }

    filteredUsers.forEach((user) => {
        delete user.password;
        delete user.status;
    });

    return filteredUsers;
}

function editProfileText(login, newUsername, newTag) {
    newTagClean = newTag.split(' ').join('').split('\n').join('');
    newUsernameClean = newUsername.split('\n').join('');

    const tagValid = isTagValid(newTagClean);
    const usernameValid = isUsernameValid(newUsernameClean);

    if (!tagValid.success) {
        return tagValid;
    }

    if (!usernameValid.success) {
        return usernameValid;
    }

    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    if (user) {
        user.username = newUsernameClean;
        user.tag = newTagClean;

        saveUsersDB(users);
        return { success: true, user };
    } else {
        return { success: false, error: 'Пользователь не найден' };
    }
}

function editProfileAvatar(login, avatar) {
    const users = readUsersDB();
    const user = users.find(user => user.login === login);
    if (user) {
        user.avatar = avatar;
        
        saveUsersDB(users);
        return { success: true, user };
    } else {
        return { success: false, error: 'Пользователь не найден' };
    }
}

module.exports = {
    readUsersDB,
    saveUsersDB,
    registerUser,
    loginUser,
    getUserName,
    updateStatus,
    searchUsers,
    getUserStatus,
    getUserAvatar,
    getUserProfile,
    isTagUnique,
    editProfileText,
    editProfileAvatar,
    getCompanionInfo
};