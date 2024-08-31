const socket = require("../helpers/socket");

/**
 * 관리자 로그인 페이지
 */
const getAdminLoginPage = (req, res) => {
    console.log(req.session.msg);
    res.render('layouts/index', {
        title: '관리자 로그인',
        body: '../pages/login',
        msg: req.session.msg
    });
}

/**
 * 타이머 관리자 페이지
 */
const getAdminPage = (req, res) => {
    if (req.body.password != process.env.ADMIN_PASSWORD) {
        req.session.msg = "하하 틀렸지롱";
        return res.redirect("/admin");
    }

    delete req.session.msg;

    res.render('layouts/index', {
        title: '타이머 관리자',
        body: '../pages/admin'
    });
}

/**
 * 타이머 업데이트
 */
const updateTimer = (req, res) => {
    const io = socket.getIo();

    timerSettings = {
        title: req.body.title,
        description: req.body.description,
        endTime: new Date(req.body.endTime).getTime()
    };
    io.emit('timerUpdated', timerSettings); // 모든 클라이언트에 업데이트 전송
    res.status(200).send('Timer updated');
}

module.exports = {
    getAdminLoginPage,
    getAdminPage,
    updateTimer
};