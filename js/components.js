// COMPONENTS MANAGER
// This script injects the Header and Footer into every page.
// Changes made here update the WHOLE SITE instantly.

const COMPONENTS = {
    header: `
    <header class="header" id="header">
        <nav class="nav container">
            <a href="index.html" class="nav-logo">
                <h2 class="logo-text">MBA</h2>
            </a>

            <div class="nav-menu" id="nav-menu">
                <ul class="nav-list">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link active-link">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a href="about.html" class="nav-link">À propos</a>
                    </li>
                    <li class="nav-item">
                        <a href="skills.html" class="nav-link">Compétences</a>
                    </li>
                    <li class="nav-item">
                        <a href="services.html" class="nav-link">Services</a>
                    </li>
                    <li class="nav-item">
                        <a href="projects.html" class="nav-link">Projets</a>
                    </li>
                    <li class="nav-item">
                        <a href="experience.html" class="nav-link">Expérience</a>
                    </li>
                    <li class="nav-item">
                        <a href="contact.html" class="nav-link">Contact</a>
                    </li>
                </ul>

                <div class="nav-close" id="nav-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>

            <div class="nav-btns">
                <!-- Theme Change Button -->
                <div class="theme-toggle-wrapper">
                    <label class="theme-switch" for="checkbox">
                        <input type="checkbox" id="checkbox" />
                        <div class="slider round">
                            <div class="icon-sun">
                                <i class="fas fa-sun"></i>
                            </div>
                            <div class="icon-moon">
                                <i class="fas fa-moon"></i>
                            </div>
                        </div>
                    </label>
                </div>

                <!-- Toggle Button -->
                <div class="nav-toggle" id="nav-toggle">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
            
            <!-- Neon Indicator -->
            <div class="nav-indicator"></div>
        </nav>
        <!-- Mobile Menu Overlay -->
        <div class="mobile-nav-overlay">
            <a href="index.html" class="nav-link">Accueil</a>
            <a href="about.html" class="nav-link">À propos</a>
            <a href="skills.html" class="nav-link">Compétences</a>
            <a href="services.html" class="nav-link">Services</a>
            <a href="projects.html" class="nav-link">Projets</a>
            <a href="experience.html" class="nav-link">Expérience</a>
            <a href="contact.html" class="nav-link">Contact</a>
        </div>
    </header>
    `,

    footer: `
    <footer class="footer">
        <div class="footer-bg">
            <div class="footer-container container grid">
                <div class="footer-content">
                    <h1 class="logo-text-footer">MBA</h1>
                    <span class="footer-subtitle">Ingénieur Informatique</span>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">
                        Spécialisé en Développement Web & DevOps.
                    </p>
                </div>

                <div class="footer-socials">
                    <a href="https://www.linkedin.com/in/mosab-ben-abdellah-b6b7052b9/" target="_blank" class="footer-social">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/MBA13042004" target="_blank" class="footer-social">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="#" class="footer-social">
                        <i class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
            <p class="footer-copy">&#169; 2024 Mosab Ben Abdellah. Tous droits réservés.</p>
        </div>
    </footer>
    
    <!-- SCROLL UP -->
    <a href="#" class="scrollup" id="scroll-up">
        <i class="fas fa-arrow-up scrollup-icon"></i>
    </a>
    <div class="progress-wrap">
        <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
    </div>
    `
};

function injectLayout() {
    // Inject Header
    document.body.insertAdjacentHTML('afterbegin', COMPONENTS.header);

    // Inject Footer
    document.body.insertAdjacentHTML('beforeend', COMPONENTS.footer);

    // Set Active Link based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-link');
        }
    });
}

// Run injection immediately
injectLayout();
