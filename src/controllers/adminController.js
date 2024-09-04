const socket = require("../helpers/socket");
let timerSettings = require("../config/timerSettings");

/**
 * 관리자 로그인 페이지
 */
const adminLoginPage = (req, res) => {
    if (req.session.isAdmin) {
        return adminPage(req, res);
    }

    res.render('layouts/index', {
        title: '관리자 로그인',
        body: '../pages/login',
        msg: req.session.msg
    });
}

/**
 * 타이머 관리자 페이지
 */
const adminPage = (req, res) => {
    if (!req.session.isAdmin && req.body.password != process.env.ADMIN_PASSWORD) {
        req.session.msg = "하하 틀렸지롱";
        return res.redirect("/admin");
    }

    delete req.session.msg;
    req.session.isAdmin = true;

    res.render('layouts/index', {
        title: '타이머 관리자',
        body: '../pages/admin',
        extraJs: [
            "/assets/js/admin.js"
        ]
    });
}

/**
 * 타이머 업데이트
 */
const updateTimer = (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(400).send('에헤이 안되지 안돼~');
    }

    const io = socket.getIo();

    timerSettings.endTime = new Date(req.body.date).getTime();
    timerSettings.totalTime = timerSettings.endTime - Date.now();
    timerSettings.pauseTime = 0;
    timerSettings.isPaused = false;

    io.emit('timerUpdated', timerSettings); // 모든 클라이언트에 업데이트 전송
    res.status(200).send('Timer updated');
}

/**
 * 타이머 삭제
 */
const deleteTimer = (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(400).send('당연히 막아놨지요');
    }

    const io = socket.getIo();

    timerSettings.title = '';
    timerSettings.description = '';
    timerSettings.totalTime = 0;
    timerSettings.endTime = 0;
    timerSettings.pauseTime = 0;
    timerSettings.isPaused = false;

    io.emit('timerUpdated', timerSettings); // 모든 클라이언트에 업데이트 전송
    res.status(200).send('Timer updated');
}

/**
 * 타이머 정지 함수
 * @returns 
 */
const pauseTimer = (req, res) => {
    if (!req.session.isAdmin || timerSettings.isPaused) {
        return res.status(400).send('막아놨지롱');
    }

    const io = socket.getIo();

    timerSettings.pauseTime = Date.now();
    timerSettings.isPaused = true;

    io.emit('timerPaused', timerSettings);
    res.status(200).send('Timer paused');
}

/**
 * 타이머 재개
 */
const resumeTimer = (req, res) => {
    if (!req.session.isAdmin || !timerSettings.isPaused) {
        return res.status(400).send('접근 차단.');
    }

    const io = socket.getIo();
    const now = Date.now();

    // 일시정지된 시간을 계산하여 종료 시간을 재설정
    timerSettings.endTime = now + timerSettings.endTime - timerSettings.pauseTime;
    timerSettings.pauseTime = 0;
    timerSettings.isPaused = false;

    io.emit('timerUpdated', timerSettings); // 모든 클라이언트에 업데이트 전송
    res.status(200).send('Timer resumed');
}

module.exports = {
    adminLoginPage,
    adminPage,
    updateTimer,
    deleteTimer,
    pauseTimer,
    resumeTimer
};