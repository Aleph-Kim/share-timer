/**
 * @typedef {Object} TimerSettings
 * @property {string} title - 제목
 * @property {string} description - 설명
 * @property {Number} totalTime - 총 시간
 * @property {Number} endTime - 종료 예정 시간
 * @property {Number} pauseTime - 일시정지된 시점
 * @property {boolean} isPaused - 일시정지 여부
 */
let timerSettings = {
    title: '',
    description: '',
    totalTime: 0,
    endTime: 0,
    pauseTime: 0,
    isPaused: false
};

module.exports = timerSettings;
