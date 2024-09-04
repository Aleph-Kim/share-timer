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
 * 타이머의 남은 시간을 업데이트 하는 함수
 * 
 * @param {Object} remainingTime 남은 시간(시, 분, 초)
 */
function updateRemainingTime(remainingTime) {
    const hourTag = document.getElementById("timerHour");
    const hourColonTag = document.getElementById("timerHourColon");
    const minutesTag = document.getElementById("timerMinutes");
    const secondsTag = document.getElementById("timerSeconds");

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

document.addEventListener('DOMContentLoaded', function () {
    themeToggle();
});
