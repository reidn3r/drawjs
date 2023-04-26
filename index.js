require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

//cookie-parser
app.use(cookieParser());

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(favicon(path.join(__dirname, 'public', 'icon', 'pen.png')));

//routes
app.use('/', require('./routes/router'));

const db = require('./models/index');

db.sequelize.authenticate()
.then(() => {
    server.listen(PORT, () => console.log(`running at: http://localhost:${PORT}`));
    console.log("\nMySQL connection running at: PORT 33061");
    })
    .catch((err) => {
        console.log(err);
    })