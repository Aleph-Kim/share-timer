const socket = require("../helpers/socket");

/**
 * 타이머 관리자 페이지
 */
const getAdminPage = (req, res) => {
    res.render('layouts/index', {
        title: 'Timer Admin',
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

module.exports = { getAdminPage, updateTimer };