/**
 * 타이머 업데이트
 *
 * @async
 * @function timerUpdate
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {Promise<void>} 타이머 업데이트 완료 Promise 객체
 */
async function timerUpdate (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const endTime = document.getElementById('endTime').value;

    await fetch('/admin/update-timer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, endTime })
    });

    alert('Timer updated');
}

/**
 * 남은 시간 출력
 *
 * @function updateTimeRemaining
 * @param {number} endTime - 밀리초 단위 종료 시간
 */
function updateTimeRemaining(endTime) {
    function update() {
        const now = Date.now();
        const timeRemaining = endTime - now;

        if (timeRemaining <= 0) {
            document.getElementById('timeRemaining').textContent = "Time's up!";
            clearInterval(interval);
        } else {
            document.getElementById('timeRemaining').textContent = timeRemaining + " ms remaining";
        }
    }

    interval = setInterval(update, 100);
    update();
}