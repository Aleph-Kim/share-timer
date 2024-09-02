/**
 * 남은 시간 출력 함수
 *
 * @param {number} endTime - 밀리초 단위 종료 시간
 */
function updateTimeRemaining(endTime) {
    // 타이머 디스플레이
    const timeDisplay = document.querySelector('.time');
    // 타이머 써클 SVG
    const timerCircleForeground = document.querySelector('.timer-circle-foreground');
    // 프로그레스 바
    const progressBar = document.querySelector('.progress');
    const progressPer = document.querySelector('.progress-per');

    // 종료 시간
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = getEndDateText(endTime);

    // 총 타이머 시간 (초 단위) 계산
    const totalTime = Math.floor((endTime - Date.now()) / 1000);

    // 반지름 계산
    const rPercentage = parseFloat(timerCircleForeground.getAttribute('r')); // r 값(%)
    const svgWidth = timeDisplay.clientWidth; // 서클 넓이
    const radius = svgWidth * rPercentage / 100; // 반지름

    // 원의 둘레를 계산
    const circleLength = 2 * Math.PI * radius;

    // SVG 원의 strokeDasharray와 strokeDashoffset 초기 설정
    // strokeDasharray는 원의 전체 길이를 설정하며, strokeDashoffset은 원의 둘레를 초기화
    timerCircleForeground.style.strokeDasharray = `${circleLength} ${circleLength}`;
    timerCircleForeground.style.strokeDashoffset = circleLength;

    // 타이머를 업데이트하는 인터벌 변수
    let timerInterval;

    function update() {
        // 밀리초 단위 현재 시간
        const currentTime = Date.now();

        // 남은 시간 계산(0보다 작으면 0으로 설정)
        const remainingTime = Math.max(Math.floor((endTime - currentTime) / 1000), 0);

        // 남은 시간 업데이트
        timeDisplay.textContent = getRemainingTimeText(remainingTime);

        // 프로그래스 바 업데이트
        updateProgress(progressBar, progressPer, totalTime, remainingTime);

        // 써클 업데이트
        updateCircle(timerCircleForeground, circleLength, totalTime, remainingTime);

        // 남은 시간이 0이면 타이머를 정지
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
        }
    }

    timerInterval = setInterval(update, 100);

    update();
}

/**
 * 프로그래스 바의 너비와 퍼센트 업데이트 함수
 * @param {*} progressBar 프로그래스 바
 * @param {*} progressPer 프로그래스 바 퍼센트
 * @param {*} totalTime 총 타이머 시간
 * @param {*} remainingTime 남은 시간
 */
function updateProgress(progressBar, progressPer, totalTime, remainingTime) {
    // 경과된 시간 계산
    const elapsed = totalTime - remainingTime;

    // 프로그레스 바의 너비 업데이트
    const percentage = (elapsed / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;

    // 프로그레스 바 퍼센트 업데이트
    progressPer.textContent = Math.trunc(percentage);
}

/**
 * 써클의 색상과 길이를 변경하는 함수
 * @param {*} timerCircleForeground 타이머 써클 SVG
 * @param {*} circleLength 써클 길이
 * @param {*} totalTime 총 타이머 시간
 * @param {*} remainingTime 남은 시간
 */
function updateCircle(timerCircleForeground, circleLength, totalTime, remainingTime) {
    // 써클 길이 변경
    const offset = circleLength - (remainingTime / totalTime) * circleLength;
    timerCircleForeground.style.strokeDashoffset = offset;

    // 써클 색상 변경
    const redValue = Math.floor((1 - remainingTime / totalTime) * 255);
    const blueValue = Math.floor((remainingTime / totalTime) * 200) + 55;
    const strokeColor = `rgb(${redValue}, 100, ${blueValue})`;
    timerCircleForeground.style.stroke = strokeColor;
}

/**
 * 입력 시간을 기준으로 종료 날짜, 시간을 문자열로 반환하는 함수
 * 
 * @param {number|string|Date} endTime - 종료 시간(밀리초)
 * @returns {string} - 종료 날짜, 시간 문자열
 *                     Ex) "2024년 8월 31일 14시 30분 15초", "8월 31일 14시 30분 15초", "31일 14시 30분 15초", "14시 30분 15초"
 */
function getEndDateText(endTime) {
    const endDate = new Date(endTime);
    const now = new Date();
    const [endYear, endMonth, endDay] = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()];

    // 기본 반환 문자열
    const defaultTimeText = `${endDate.getHours()}시 ${endDate.getMinutes()}분`;

    // 년도가 다르면 년도 추가
    if (endYear !== now.getFullYear()) {
        return `${endYear}년 ${endMonth}월 ${endDay}일 ` + defaultTimeText;
    }

    // 월이 다르면 월 추가
    if (endMonth !== now.getMonth() + 1) {
        return `${endMonth}월 ${endDay}일 ` + defaultTimeText;
    }

    // 일이 다르면 일 추가
    if (endDay !== now.getDate()) {
        return `${endDay}일 ` + defaultTimeText;
    }

    if (endDate.getSeconds() != 0){
        return defaultTimeText + ` ${endDate.getSeconds()}초`;
    }

    return defaultTimeText;
}

/**
 * 남은 시간을 시:분:초 문자열로 반환하는 함수
 * 
 * @param {number} remainingTime - 남은 시간(초 단위)
 * @returns {string} - 시:분:초 형식으로 변환한 남은 시간
 *                     Ex) "03:25", "01:45:30"
 */
function getRemainingTimeText(remainingTime) {
    // 남은 시간 - 분
    const minutes = remainingTime / 60;
    // 남은 시간 문자열 - 초
    const secondsText = String(remainingTime % 60).padStart(2, '0');

    // 반환할 문자열
    let remainingTimeText;

    if (minutes > 59) { // 1시간 이상 남았을 경우
        // 남은 시간 문자열 - 시간
        const hourText = String(Math.floor(minutes / 60)).padStart(2, '0');
        // 남은 시간 문자열 - 분
        const minutesText = String(Math.floor(minutes % 60)).padStart(2, '0');
        remainingTimeText = `${hourText}:${minutesText}:${secondsText}`
    } else {
        // 남은 시간 문자열 - 분
        const minutesText = String(Math.floor(minutes)).padStart(2, '0');
        remainingTimeText = `${minutesText}:${secondsText}`
    }

    return remainingTimeText;
}