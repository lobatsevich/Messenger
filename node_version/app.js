const { server, app, io } = require('./config');

const authenticationRouter = require('./routes/authRouter');
const socketIORouter = require('./routes/socketRouter');
const mainRouter = require('./routes/mainRouter');

authenticationRouter(app);
socketIORouter(io);
mainRouter(app);

server.listen(2007, () => {
  console.log(`Сервер запущен!`);
});