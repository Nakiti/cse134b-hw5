(function() {
    document.documentElement.classList.remove('no-js');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    themeToggle.setAttribute('type', 'button');
    themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('header nav');
        const header = document.querySelector('header');

        if (nav) {
            nav.insertBefore(themeToggle, nav.firstChild);
        } else if (header) {
            header.insertBefore(themeToggle, header.firstChild);
        } else {
            document.body.insertBefore(themeToggle, document.body.firstChild);
        }

        themeToggle.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark');
    });

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
        localStorage.setItem('theme', newTheme);
    }

    themeToggle.addEventListener('click', toggleTheme);

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

})();
