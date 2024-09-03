const alarmSound = new Audio('/assets/sounds/alarm_sound.mp3');

/**
 * 남은 시간 출력 함수
 *
 * @param {number} endTime - 밀리초 단위 종료 시간
 */
function updateTimer(startTime, endTime) {
    // 타이머 디스플레이
    const timeDisplay = document.querySelector('.time-text');
    // 타이머 써클 SVG
    const timerCircleForeground = document.querySelector('.timer-circle-foreground');
    // 프로그레스 바
    const progressBar = document.querySelector('.progress');
    const progressPer = document.querySelector('.progress-per');

    // 종료 시간
    const alarmTime = document.querySelector('.alarm-time');
    alarmTime.textContent = getEndDateText(endTime);

    // 총 타이머 시간 (초 단위) 계산
    const totalTime = Math.floor((endTime - startTime) / 1000);

    // 써클 둘레
    let circleLength = setCircleAttributes();

    // 써클 초기 설정 함수
    function setCircleAttributes() {
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

    function update() {
        // 밀리초 단위 현재 시간
        const currentTime = Date.now();

        // 남은 초단위 시간 (0보다 작으면 0으로 설정)
        const remainingSeconds = Math.max(Math.floor((endTime - currentTime) / 1000), 0);

        // 남은 시간
        const remainingTime = getSecondToTime(remainingSeconds);

        updateRemainingTime(remainingTime);

        // 프로그래스 바 업데이트
        updateProgress(progressBar, progressPer, totalTime, remainingSeconds);

        // 써클 업데이트
        updateCircle(timerCircleForeground, circleLength, totalTime, remainingSeconds);

        // 남은 시간이 0이면 타이머를 정지
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            soundOn();
        }
    }

    timerInterval = setInterval(update, 100);

    update();

    // 브라우저 리사이즈 이벤트 핸들러 등록
    window.addEventListener('resize', () => {
        circleLength = setCircleAttributes();
    });
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

    if (endDate.getSeconds() != 0) {
        return defaultTimeText + ` ${endDate.getSeconds()}초`;
    }

    return defaultTimeText;
}

/**
 * 초 단위 시간을 시, 분, 초로 계산하여 반환하는 함수
 * 
 * @param {number} remainingTime - 초 단위 시간
 * @returns {object} - 시, 분, 초로 계산한 시간
 */
function getSecondToTime(remainingTime) {
    // 남은 시간 - 시
    let hour = 0;
    // 남은 시간 - 분
    let minutes = Math.floor(remainingTime / 60);
    // 남은 시간 - 초
    const seconds = remainingTime % 60;

    // 1시간 이상 남았을 경우
    if (minutes > 59) {
        hour = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return {
        hour: hour,
        minutes: minutes,
        seconds: seconds,
    };
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

function updateRemainingTime(remainingTime) {
    const hourTag = document.getElementById("timer-hour");
    const hourColonTag = document.getElementById("timer-hour-colon");
    const minutesTag = document.getElementById("timer-minutes");
    const secondsTag = document.getElementById("timer-seconds");

    if (remainingTime.hour > 0) {
        hourTag.setAttribute("style", `--value:${remainingTime.hour}`);
        hourTag.style.display = "inline-block";
        hourColonTag.style.display = "inline-block";
    } else {
        hourTag.style.display = "none";
        hourColonTag.style.display = "none";
    }

    minutesTag.setAttribute("style", `--value:${remainingTime.minutes}`);
    secondsTag.setAttribute("style", `--value:${remainingTime.seconds}`);
}