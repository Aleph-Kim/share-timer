let io;

/**
* Socket.IO 초기화
*
* @param server - HTTP 서버 인스턴스
* @returns 초기화된 Socket.IO 서버 인스턴스
*/
const init = (server) => {
    io = require('socket.io')(server);
    return io;
}

/**
 * 초기화된 Socket.IO 서버 인스턴스 반환
 *
 * @throws {Error} 초기화되지 않은 경우 에러
 * @returns 초기화된 Socket.IO 서버 인스턴스
 */
const getIo = () => {
    if (!io) {
        throw new Error('Socket을 가져오는 도중 오류가 발생했습니다.');
    }
    return io;
}

module.exports = { init, getIo };
