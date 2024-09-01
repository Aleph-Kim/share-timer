/**
 * 404 에러 핸들러
 * @param {*} req 요청 객체
 * @param {*} res 응답 객체
 * @param {*} next 다음 미들웨어를 호출할 함수
 * @returns 
 */
const notFoundHandler = (req, res, next) => {
    return res.render('layouts/index', {
        title: '404 - 페이지를 찾을 수 없습니다.',
        body: '../pages/notFound',
        extraCss: ['/assets/css/error.css']
    });;
};

module.exports = notFoundHandler;
