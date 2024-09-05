/**
 * 테마 전환
 */
function themeToggle() {
    // 토글 버튼
    const themeToggleBtn = document.getElementById('themeToggle');
    // 토글 아이콘
    const themeIcon = document.getElementById('themeIcon');
    // html 태그
    const htmlElement = document.documentElement;

    // 기본 테마 세팅
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
        themeIcon.textContent = currentTheme === 'sunset' ? '🌙' : '☀️';
    }

    // 테마 변경
    themeToggleBtn.addEventListener('click', () => {
        //현재 테마
        const currentTheme = htmlElement.getAttribute('data-theme');
        // 변경할 테마
        const newTheme = currentTheme === 'sunset' ? 'nord' : 'sunset';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // 아이콘 변경
        themeIcon.textContent = newTheme === 'sunset' ? '🌙' : '☀️';
    });
}

/**
 * 사운드 아이콘 토글 함수
 */
function soundIconToggle() {
    // 토글 버튼
    const isChecked = document.getElementById('soundCheck').checked;
    // 토글 아이콘
    const soundIcon = document.getElementById('soundIcon');

    if (isChecked) {
        soundIcon.textContent = "🔈";
    } else {
        soundIcon.textContent = "🔇";
    }
}

/**
 * 초 단위 시간을 시, 분, 초로 계산하여 반환하는 함수
 * 
 * @param {Number} remainingTime - 초 단위 시간
 * @returns {Object} - 시, 분, 초로 계산한 시간
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
 * 타이머의 시간을 업데이트 하는 함수
 * 
 * @param {Object} time 표시할 시간(시, 분, 초)
 */
function updateTimeCount(time) {
    const hourTag = document.getElementById("timerHour");
    const hourColonTag = document.getElementById("timerHourColon");
    const minutesTag = document.getElementById("timerMinutes");
    const secondsTag = document.getElementById("timerSeconds");

    if (time.hour > 0) {
        hourTag.setAttribute("style", `--value:${time.hour}`);
        hourTag.style.display = "flex";
        hourColonTag.style.display = "flex";
    } else {
        hourTag.style.display = "none";
        hourColonTag.style.display = "none";
    }

    minutesTag.setAttribute("style", `--value:${time.minutes}`);
    secondsTag.setAttribute("style", `--value:${time.seconds}`);
}

/**
 * 오버 타이머 실행 함수
 * @param {*} endTime 타이머 종료 시간
 */
function overRunTimer(endTime) {
    // 밀리초 단위 현재 시간
    const now = Date.now();

    const remainingSeconds = Math.floor((now - endTime) / 1000);

    // 남은 시간(시, 분, 초)
    const remainingTime = getSecondToTime(remainingSeconds);

    // 남은 시간 업데이트
    updateTimeCount(remainingTime);
}

/**
 * 오버 타임 마크(+) 노출처리 함수
 */
function showOverTimerMark() {
    const overTimerMark = document.getElementById('overTimerMark');
    overTimerMark.classList.remove('hidden');
    setTimeout(() => {
        overTimerMark.classList.remove('opacity-0', 'scale-75');
        overTimerMark.classList.add('opacity-100', 'scale-100');
    }, 10);
}

/**
 * 오버 타임 마크(+) 숨김처리 함수
 */
function hiddenOverTimerMark() {
    const overTimerMark = document.getElementById('overTimerMark');
    overTimerMark.classList.remove('opacity-100', 'scale-100');
    overTimerMark.classList.add('opacity-0', 'scale-75');
    setTimeout(() => {
        overTimerMark.classList.add('hidden');
    }, 500);
}

document.addEventListener('DOMContentLoaded', function () {
    // 테마 전환 이벤트 등록
    themeToggle();
});
