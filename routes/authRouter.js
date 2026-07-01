const path = require('path');
const dbUtilsUsers = require('../database/users/db_utils');

function authenticationRouter(app) {
    app.get('/auth', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'auth.html'));
    });
      
    app.post('/register', (req, res) => {
        const { login, password, username } = req.body;
    
        const registrationResult = dbUtilsUsers.registerUser(login, password, username);
    
        if (registrationResult.success) {
        req.session.userLogin = registrationResult.user.login;
        res.redirect('/');
        } else {
        res.send(registrationResult.error);
        }
    });
    
    app.post('/login', (req, res) => {
        const { login, password } = req.body;
    
        const loginResult = dbUtilsUsers.loginUser(login, password);
    
        if (loginResult.success) {
        req.session.userLogin = loginResult.user.login;
        res.redirect('/');
        } else {
        res.send(loginResult.error);
        }
    })
    
    app.use((req, res, next) => {
        if (!req.session.userLogin && req.url !== '/auth') {
        return res.redirect('/auth');
        } else {
        return next();
        }
    });
}

module.exports = authenticationRouter;