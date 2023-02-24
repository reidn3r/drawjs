require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const app = express();

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.set('socketio', io);

const PORT = process.env.PORT || 8080;

//log requests
app.use(morgan('dev'));

//ejs view-engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/router'));

/*
    1. Login
    2. Principal
    3. Sobre
        - Fala sobre projeto
        - Links para github/insta/linkedin
*/

server.listen(PORT, () => console.log(`running at: http://localhost:${PORT}`));