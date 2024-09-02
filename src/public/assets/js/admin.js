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
}

/**
 * 현재시간으로부터 입력 받은 초 단위의 시간만큼 증가한 시간을 특정 형태로 반환하는 함수
 * @param addSeconds 
 * @returns 
 */
function endTimeCalculate(addSeconds) {

    // 년, 월, 일 가져오기
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // 시, 분 가져오기
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 형식에 맞게 문자열 반환
    return date;
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