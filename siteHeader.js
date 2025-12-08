class SiteHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <a href="index.html" id="header-title">Nikhil Akiti</a>
                    <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="header-link-container">
                        <li class="header-link"><a href="index.html">Home</a></li>
                        <li class="header-link"><a href="projects.html">Projects</a></li>
                        <li class="header-link"><a href="experiences.html">Experience</a></li>
                        <li class="header-link"><a href="about.html">About</a></li>
                    </ul>
                </nav>
            </header>
        `;

        // Set up hamburger menu functionality
        this.setupMenuToggle();
    }

    setupMenuToggle() {
        const menuToggle = this.querySelector('.menu-toggle');
        const menuLinks = this.querySelector('.header-link-container');

        if (menuToggle && menuLinks) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                menuLinks.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
            });

            // Close menu when a link is clicked
            const links = menuLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    menuLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
}

customElements.define('site-header', SiteHeader);

