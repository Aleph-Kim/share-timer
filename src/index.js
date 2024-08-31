const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);

// env 파일 사용
require('dotenv').config();

// session 사용
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 소켓 설정
const socketHelper = require('./helpers/socket');
const io = socketHelper.init(server);

// 라우터 설정
const adminRoutes = require("./routes/adminRoute");
const timerRoutes = require("./routes/timerRoute");

// application/x-www-form-urlencoded(html 폼) 데이터 파싱
app.use(express.urlencoded({ extended: false }));
// application/json 데이터 파싱
app.use(express.json());

// 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 정적 파일 서빙
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// 라우터
app.use('/admin', adminRoutes);
app.use('/', timerRoutes);

let timerSettings = {
    title: 'Default Title',
    description: 'Default Description',
    endTime: Date.now()
};

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('timerUpdated', timerSettings);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});
