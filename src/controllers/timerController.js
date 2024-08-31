/**
 * 타이머 페이지
 */
const getTimerPage = (req, res) => {
    res.render('layouts/index', {
        title: 'Timer',
        body: '../pages/timer',
    });
};

module.exports = { getTimerPage }