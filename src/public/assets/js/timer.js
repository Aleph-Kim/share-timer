// 알람소리 파일
const alarmSound = new Audio('/assets/sounds/alarm_sound.mp3');

// 써클 길이
let circleLength;

/**
 * 타이머 설정 함수
 * @param {Object} 타이머 설정값
 */
function initializeTimer(timerSettings) {
    // 써클 길이 초기화
    circleLength = setCircleAttributes();
    // 브라우저 리사이즈 이벤트 핸들러 등록
    window.addEventListener('resize', () => {
        circleLength = setCircleAttributes();
    });

    // 타이머가 설정되지 않았을 경우
    if (timerSettings.endTime == 0) {
        return handleNoneTimer();
    }

    // 정지된 타이머일 경우
    if (timerSettings.isPause) {
        return handlePauseTimer(timerSettings, circleLength);
    }

    // 종료된 타이머일 경우
    if (Date.now() > timerSettings.endTime) {
        return handleEndTimer(timerSettings.endTime);
    }

    // 타이머 실행
    handleRunTimer(timerSettings, circleLength);
}

/**
 * 타이머 세팅 - 타이머가 없는 경우
 */
function handleNoneTimer() {
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = "타이머를 준비 중입니다.";

    // 남은 시간 업데이트
    updateTimeCount(getSecondToTime(0));

    // 오버 타임 마크(+) 숨김처리
    hiddenOverTimerMark();
}

/**
 * 타이머 세팅 - 타이머가 종료된 경우
 * @param {Number} endTime 타이머 종료 시간
 */
function handleEndTimer(endTime) {
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = "타이머가 종료되었습니다.";

    // 오버 타임 마크(+) 노출처리
    showOverTimerMark();

    // 오버 타이머 실행
    timerInterval = setInterval(function () {
        overRunTimer(endTime);
    }, 1000);
}

/**
 * 타이머 세팅 - 타이머가 정지된 경우
 * @param {Object} timerSettings 타이머 설정값
 * @param {Number} circleLength 써클 길이
 */
function handlePauseTimer(timerSettings, circleLength) {
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = "타이머가 정지되었습니다.";

    // 오버 타임 마크(+) 숨김처리
    hiddenOverTimerMark();
    setPauseTimer(timerSettings, circleLength);
}

/**
 * 타이머 세팅 - 타이머가 진행중인 경우
 * @param {Object} timerSettings 타이머 설정값
 * @param {Number} circleLength 써클 길이
 */
function handleRunTimer(timerSettings, circleLength) {
    // 타이머 써클
    const timerCircleForeground = document.querySelector('.timer-circle-foreground');

    // 프로그레스 바
    const progressBar = document.querySelector('.progress');
    const progressPer = document.querySelector('.progress-per');

    // 종료 시간
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = getEndDateText(timerSettings.endTime);

    // 오버 타임 마크(+) 숨김처리
    hiddenOverTimerMark();

    timerInterval = setInterval(function () {
        setRunTimer(timerSettings, timerCircleForeground, progressBar, progressPer, circleLength);
    }, 1000);
}

/**
 * 써클 초기화 함수
 * @returns 써클 길이
 */
function setCircleAttributes() {
    // 타이머 써클 SVG
    const timerCircleForeground = document.querySelector('.timer-circle-foreground');
    // 타이머 디스플레이
    const timeDisplay = document.querySelector('.time-text');

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

    return circleLength;
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

    // 년도가 다르면 년도 추가
    if (endYear !== now.getFullYear()) {
        return `${endYear}년 ${endMonth}월 ${endDay}일 ${endDate.getHours()}시 ${endDate.getMinutes()}분`;
    }

    // 날이 다르면 월, 일 추가
    if (endDay !== now.getDate()) {
        return `${endMonth}월 ${endDay}일 ${endDate.getHours()}시 ${endDate.getMinutes()}분`;
    }

    // 분과 초가 0일 경우 "정각"으로 표시
    if (endDate.getMinutes() + endDate.getSeconds() == 0) {
        return `${endDate.getHours()}시 정각`;
    }

    if (endDate.getSeconds() != 0) {
        return `${endDate.getHours()}시 ${endDate.getMinutes()}분 ${endDate.getSeconds()}초`;
    }

    return `${endDate.getHours()}시 ${endDate.getMinutes()}분`;
}

/**
 * 정지된 타이머 세팅
 * @param {Object} timerSettings 타이머 설정값
 * @param {Element} timerCircleForeground 타이머 써클
 * @param {Element} progressBar 프로그래스 바
 * @param {Element} progressPer 프로그래스 바 내부 진행 퍼센트
 * @param {Number} circleLength 써클 길이
 */
function setPauseTimer(timerSettings, circleLength) {
    // 타이머 써클
    const timerCircleForeground = document.querySelector('.timer-circle-foreground');

    // 프로그레스 바
    const progressBar = document.querySelector('.progress');
    const progressPer = document.querySelector('.progress-per');

    // 남은 시간
    const remainingSeconds = Math.floor((timerSettings.endTime - timerSettings.pauseTime) / 1000);
    const remainingTime = getSecondToTime(remainingSeconds);

    // 총 타이머 시간 (초 단위) 계산
    const totalTime = Math.floor(timerSettings.totalTime / 1000);

    // 남은 시간 업데이트
    updateTimeCount(remainingTime);

    // 프로그래스 바 업데이트
    updateProgress(progressBar, progressPer, totalTime, remainingSeconds);

    // 써클 업데이트
    updateCircle(timerCircleForeground, circleLength, totalTime, remainingSeconds);
}

/**
 * 진행중인 타이머 세팅
 * @param {Object} timerSettings 타이머 설정값
 * @param {Element} timerCircleForeground 타이머 써클
 * @param {Element} progressBar 프로그래스 바
 * @param {Element} progressPer 프로그래스 바 내부 진행 퍼센트
 * @param {Number} circleLength 써클 길이
 */
function setRunTimer(timerSettings, timerCircleForeground, progressBar, progressPer, circleLength) {
    // 밀리초 단위 현재 시간
    const now = Date.now();

    // 총 타이머 시간 (초 단위) 계산
    const totalTime = Math.floor(timerSettings.totalTime / 1000);

    // 남은 초단위 시간 (0보다 작으면 0으로 설정)
    const remainingSeconds = Math.max(Math.floor((timerSettings.endTime - now) / 1000), 0);

    // 남은 시간(시, 분, 초)
    const remainingTime = getSecondToTime(remainingSeconds);

    // 남은 시간 업데이트
    updateTimeCount(remainingTime);

    // 프로그래스 바 업데이트
    updateProgress(progressBar, progressPer, totalTime, remainingSeconds);

    // 써클 업데이트
    updateCircle(timerCircleForeground, circleLength, totalTime, remainingSeconds);

    // 남은 시간이 0이면 타이머를 정지
    if (remainingSeconds == 0) {
        endTimer(timerSettings.endTime);
    }
}

/**
 * 타이머를 종료시키는 함수
 */
function endTimer(endTime) {
    const alarmTime = document.querySelector('.alarm-time');

    clearInterval(timerInterval);

    setTimeout(() => {
        alarmTime.textContent = "타이머가 종료되었습니다.";
        soundOn();

        // 오버 타임 마크(+) 노출처리
        showOverTimerMark();

        // 오버 타이머 실행
        timerInterval = setInterval(function () {
            overRunTimer(endTime);
        }, 1000);
    }, 1000);

}

/**
 * 프로그래스 바의 너비와 퍼센트 업데이트 함수
 * @param {*} progressBar 프로그래스 바
 * @param {*} progressPer 프로그래스 바 퍼센트
 * @param {*} totalTime 총 타이머 시간
 * @param {*} remainingTime 남은 시간
 */
function updateProgress(progressBar, progressPer, totalTime, remainingTime) {
    // 타이머 삭제 시 %가 NaN이 됨을 방지
    if (totalTime == 0) {
        totalTime -= 1;
    }

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
 * 알람소리 실행 함수
 */
function soundOn() {
    const soundChecked = document.getElementById("soundCheck").checked;
    const soundOffBtn = document.getElementById("soundOffBtn");

    // 알람소리를 듣겠다고 체크했을 경우에만
    if (soundChecked) {
        alarmSound.loop = true; // 반복 재생
        alarmSound.play();
        soundOffBtn.style.display = "inline-flex";
    }
}

/**
 * 알람소리 끄기 함수
 */
function soundOff() {
    const soundOffBtn = document.getElementById("soundOffBtn");
    soundOffBtn.style.display = "none";

    alarmSound.pause();
}