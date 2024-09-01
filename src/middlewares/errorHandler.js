/**
 * 에러 핸들러
 * @param {*} err 에러 객체
 * @param {*} req 요청 객체
 * @param {*} res 응답 객체
 * @param {*} next 다음 미들웨어를 호출할 함수
 * @returns 
 */
const errorHandler = (err, req, res, next) => {
    console.error(err); // 에러 로깅

    return res.render('layouts/index', {
        title: '에러 페이지',
        body: '../pages/error',
        extraCss: ['/assets/css/error.css']
    });
};

module.exports = errorHandler;
