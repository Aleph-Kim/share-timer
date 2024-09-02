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

function themeToggle() {
    // 토글 버튼
    const themeToggleBtn = document.getElementById('theme-toggle');
    // 토글 아이콘
    const themeIcon = document.getElementById('theme-icon');
    // html 태그
    const htmlElement = document.documentElement;

    // 기본 테마 세팅
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
        themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }

    // 테마 변경
    themeToggleBtn.addEventListener('click', () => {
         //현재 테마
        const currentTheme = htmlElement.getAttribute('data-theme');
        // 변경할 테마
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // 아이콘 변경
        themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    themeToggle();
});
