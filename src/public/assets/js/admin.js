/**
 * 타이머 업데이트 함수
 *
 * @async
 * @function timerUpdate
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {Promise<void>} 타이머 업데이트 완료 Promise 객체
 */
async function timerUpdate(event) {
    // 현재 시간
    const date = new Date();

    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const addSeconds = document.getElementById('addSeconds').value;

    // 현재 시간에 입력받은 시간 추가
    date.setSeconds(date.getSeconds() + parseInt(addSeconds));

    await fetch('/admin', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, date })
    });

    alert('타이머가 업데이트 되었습니다.');
    setButtons("run");
}

/**
 * 타이머 삭제 함수
 */
async function deleteTimer() {
    if (confirm("정말 삭제하시겠습니까?") == false) {
        return;
    }

    await fetch('/admin', {
        method: 'DELETE'
    });

    alert('타이머가 삭제되었습니다.');
    setButtons("end");
}

/**
 * 타이머 정지 함수
 */
async function pauseTimer() {
    await fetch('/admin/pause', {
        method: 'PUT'
    });

    alert('타이머가 정지되었습니다.');
    setButtons("paused");
}

/**
 * 타이머 재시작 함수
 */
async function resumeTimer() {
    await fetch('/admin/resume', {
        method: 'PUT'
    });

    alert('타이머가 재개되었습니다.');
    setButtons("run");
}

/**
 * 타이머 상태별 버튼 노출 수정 함수
 * @param {String} status 상태값
 */
function setButtons(status) {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    switch (status) {
        case "run":
            startBtn.textContent = "새 타이머 시작";
            pauseBtn.style.display = "inline-flex"
            deleteBtn.style.display = "inline-flex"
            resumeBtn.style.display = "none"
            break;
        case "paused":
            resumeBtn.style.display = "inline-flex"
            deleteBtn.style.display = "inline-flex"
            pauseBtn.style.display = "none"
            break;
        case "end":
            pauseBtn.style.display = "none"
            deleteBtn.style.display = "none"
            resumeBtn.style.display = "none"
            startBtn.textContent = "타이머 시작";
            break;
    }
}

/**
 * select 태그 값을 초 단위로 변환하여 addSeconds input에 저장 함수
 */
function changeTimeSelect() {
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = parseInt(document.getElementById('minutes').value);
    const seconds = parseInt(document.getElementById('seconds').value);

    // 시간, 분, 초를 모두 초 단위로 변환하여 합산
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    // addSeconds input에 값 저장
    document.getElementById('addSeconds').value = totalSeconds;
}

/**
 * 입력된 값을 addSeconds input에 추가 및 select 업데이트 함수
 * @param seconds 추가할 초 
 */
function clickTimeBtn(seconds) {
    const addSeconds = document.getElementById('addSeconds');
    let totalSeconds = parseInt(addSeconds.value);

    // addSeconds input에 값 추가
    totalSeconds += seconds;
    addSeconds.value = totalSeconds;

    // select 태그의 값을 프리셋 값에 맞게 변경
    document.getElementById('hours').value = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    document.getElementById('minutes').value = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    document.getElementById('seconds').value = String(totalSeconds % 60).padStart(2, '0');
}

/**
 * 타이머 리셋 함수
 */
function resetTimer() {
    const addSeconds = document.getElementById('addSeconds');
    addSeconds.value = 0;

    document.getElementById('hours').value = "00";
    document.getElementById('minutes').value = "00";
    document.getElementById('seconds').value = "00";
}

/**
 * 타이머 설정 함수
 * @param {Object} 타이머 설정값
 */
function setTimer(timerSettings) {
    const now = Date.now();
    const remaningTimer = document.getElementById("remaningTimer");
    remaningTimer.style.display = "flex";

    // 정지된 타이머일 경우
    if (timerSettings.isPaused) {
        setPauseTimer(timerSettings)
        return;
    }

    // 종료된 타이머일 경우
    if (now > timerSettings.endTime) {
        remaningTimer.style.display = "none";
        return;
    }

    // 타이머 실행
    timerInterval = setInterval(function () {
        setRunTimer(timerSettings);
    }, 100);
}

/**
 * 정지된 타이머 세팅
 * @param {Object} timerSettings 타이머 설정값
 */
function setPauseTimer(timerSettings) {
    const remainingSeconds = Math.floor((timerSettings.endTime - timerSettings.pauseTime) / 1000);
    const remainingTime = getSecondToTime(remainingSeconds);

    // 남은 시간 업데이트
    updateRemainingTime(remainingTime);
}

/**
 * 진행중인 타이머 세팅
 * @param {Object} timerSettings 타이머 설정값
 */
function setRunTimer(timerSettings) {
    // 밀리초 단위 현재 시간
    const now = Date.now();

    // 남은 초단위 시간 (0보다 작으면 0으로 설정)
    const remainingSeconds = Math.max(Math.floor((timerSettings.endTime - now) / 1000), 0);
    // 남은 시간(시, 분, 초)
    const remainingTime = getSecondToTime(remainingSeconds);

    // 남은 시간 업데이트
    updateRemainingTime(remainingTime);

    // 남은 시간이 0이면 타이머를 정지
    if (remainingSeconds <= 0) {
        endTimer();
    }
}