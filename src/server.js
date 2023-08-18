require('dotenv').config();
const initModel = require('./models/initModel');
const app = require('./app');
const { db } = require('./database/config');
const { Server } = require('socket.io');
const Sockets = require('./Sockets');

db.authenticate()
  .then(() => console.log('Datbase Connected..!'))
  .catch((err) => console.log(err));

initModel();

db.sync({ force: false })
  .then(() => console.log('Datbase Synced..!'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3100;

const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

new Sockets(io);
