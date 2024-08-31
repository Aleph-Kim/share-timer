/**
 * 타이머 업데이트
 *
 * @async
 * @function timerUpdate
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {Promise<void>} 타이머 업데이트 완료 Promise 객체
 */
async function timerUpdate(event) {
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