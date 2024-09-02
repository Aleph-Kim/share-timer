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

document.addEventListener('DOMContentLoaded', function () {
    themeToggle();
});
