/**
 * 타이머 페이지
 */
const getTimerPage = (req, res) => {
    res.render('layouts/index', {
        title: 'Timer',
        body: '../pages/timer',
        extraJs: [
            '/assets/js/timer.js',
            '/socket.io/socket.io.js'
        ],
        extraCSS: ['/assets/css/timer.css']
    });
};

module.exports = { getTimerPage }