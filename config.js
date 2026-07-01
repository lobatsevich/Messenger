const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const sharedSession = require('express-socket.io-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ 
    extended: true 
}));

const sessionMw = session({
  secret: 'messenger-session',
  resave: false,
  saveUninitialized: true
});

app.use(sessionMw);
io.use(
  sharedSession(sessionMw, {
    autoSave: true,
  }),
);

module.exports = { 
    server, 
    app, 
    io 
}