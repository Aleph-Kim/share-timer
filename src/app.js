const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);

const notFoundHandler = require("./middlewares/notFoundHandler")
const errorHandler = require("./middlewares/errorHandler")

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

// 타이머 설정값
let timerSettings = require('./config/timerSettings');

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

// 404 에러 핸들링 미들웨어
app.use(notFoundHandler);

// 에러 핸들링 미들웨어
app.use(errorHandler);

io.on('connection', (socket) => {
    console.log('새로운 클라이언트 접속!');
    socket.emit('timerUpdated', timerSettings);

    socket.on('disconnect', () => {
        console.log('클라이언트 접속 종료');
    });
});

server.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});
