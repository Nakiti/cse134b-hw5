(function() {
    document.documentElement.classList.remove('no-js');

    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    document.addEventListener('DOMContentLoaded', () => {
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(themeToggle, main.firstChild);
        }
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('theme', newTheme);
    });
})();