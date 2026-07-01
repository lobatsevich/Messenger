const path = require('path');
const express = require('express');
const multer = require('multer');

const dbUtilsUsers = require('../database/users/db_utils');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatars/user-avatars');
    },
    filename: function (req, file, cb) {
        const userID = req.session.userLogin;
        const extname = path.extname(file.originalname);
        cb(null, `${userID}${extname}`);
    },
});

const upload = multer({
    storage: storage,
});

function mainRouter(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    app.post('/edit-profile', upload.single('avatar'), async (req, res) => {
        try {
            const userID = req.session.userLogin;
            const { username, tag } = req.body;

            if (!username.trim() || !tag.trim()) {
                return res.status(400).send({
                    success: false,
                    error: 'Введите корректные данные',
                });
            }

            if (!dbUtilsUsers.isTagUnique(userID, tag)) {
                return res.status(400).send({
                    success: false,
                    error: 'Этот тег уже занят',
                });
            }

            const editProfileTextResult = dbUtilsUsers.editProfileText(
                userID,
                username,
                tag,
            );

            const avatarFilename = req.file
                ? `avatars/user-avatars/${userID}${path.extname(
                      req.file.originalname,
                  )}`
                : '';

            const editProfileAvatarResult = req.file
                ? dbUtilsUsers.editProfileAvatar(userID, avatarFilename)
                : { success: true };

            return editProfileTextResult.success && editProfileAvatarResult.success
                ? res.status(200).send({
                      success: true,
                      message: 'Профиль успешно обновлен',
                  })
                : res.status(400).send({
                      success: false,
                      error: editProfileTextResult.error || editProfileAvatarResult.error,
                  });
        } catch (error) {
            console.error('Ошибка обработки запроса: ', error);

            return res.status(500).send({
                success: false,
                error: 'Ошибка обработки запроса',
            });
        }
    });

    app.use(express.static(path.join(__dirname, '../public')));
}
module.exports = mainRouter;
