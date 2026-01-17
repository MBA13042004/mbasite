
document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER
    // 1. PRELOADER (Robust Removal)
    const preloader = document.getElementById('preloader');

    const removePreloader = () => {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    };

    // Remove on window load (all assets loaded)
    window.addEventListener('load', removePreloader);

    // Fallback timeout (2 second safety - faster load)
    setTimeout(removePreloader, 2000);

    // Set current year dynamically
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // 2. THEME SWITCHER (Auto-Detect + Manual Override)
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const systemSource = window.matchMedia('(prefers-color-scheme: dark)');

    function calculateSettingAsThemeString({ localStorageTheme, systemDarkMode }) {
        if (localStorageTheme !== null) {
            return localStorageTheme;
        }
        if (systemDarkMode) {
            return 'dark';
        }
        return 'light';
    }

    function updateThemeOnHtml({ theme }) {
        document.documentElement.setAttribute('data-theme', theme);
        if (toggleSwitch) {
            toggleSwitch.checked = (theme === 'dark');
        }

        // Update Favicon & Brand Logo
        const favicon = document.querySelector('link[rel="icon"]');
        const brandLogo = document.getElementById('brandLogo');

        if (theme === 'light') {
            // Light Mode -> Usage of Dark (Black) Logo
            // User specified: "mode claire ... logo soit noire (logo-mba-light.png)"
            if (favicon) favicon.href = 'assets/logo-mba-light.png';
            if (brandLogo) brandLogo.src = 'assets/logo-mba-light.png';
        } else {
            // Dark Mode -> Usage of Light (White) Logo
            // User specified: "mode sombe ... logo soit claire (logo-mba-dark.png)"
            if (favicon) favicon.href = 'assets/logo-mba-dark.png';
            if (brandLogo) brandLogo.src = 'assets/logo-mba-dark.png';
        }
    }

    // 1. Initial Load: Auto-Detect (No localStorage persistence preferred for "refresh = auto")
    // User requested: "si l user rafrichissait la page le mode auto s active"
    // So we primarily rely on systemSource on load.

    // Check system preference immediately
    let currentTheme = systemSource.matches ? 'dark' : 'light';
    updateThemeOnHtml({ theme: currentTheme });

    // 2. Manual Toggle
    function switchTheme(e) {
        if (e.target.checked) {
            updateThemeOnHtml({ theme: 'dark' });
        } else {
            updateThemeOnHtml({ theme: 'light' });
        }
    }

    // 3. System Change Listener (Live Update)
    systemSource.addEventListener('change', (e) => {
        // Only update if user hasn't manually overridden? 
        // User said: "si user a le mode sombre donc site sombre... si user changer le site doit changer immediatement"
        // But also "refresh = auto". 
        // We will update to match system if the user hasn't explicitly set a preference *in this session*?
        // Simpler: Just update to match system change, as it's "Auto Mode".
        const newTheme = e.matches ? 'dark' : 'light';
        updateThemeOnHtml({ theme: newTheme });
    });

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme);
    }

    // 3. MOBILE MENU
    const burger = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-overlay .nav-link');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            const isExpanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            burger.classList.toggle('active'); // Optional for burger animation if CSS supports it
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- SCROLL PROGRESS ---
    const progressWrap = document.getElementById('progressWrap');
    if (progressWrap) {
        const updateProgress = () => {
            const scroll = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scroll / height) * 100;

            // Show/Hide button
            if (scroll > 50) {
                progressWrap.classList.add('active-progress');
            } else {
                progressWrap.classList.remove('active-progress');
            }

            // Update Circle
            const path = progressWrap.querySelector('path');
            if (path) {
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength + ' ' + pathLength;
                // Inverse formula: starts at pathLength (empty) and goes to 0 (full)
                const offset = pathLength * (1 - scrolled / 100);
                path.style.strokeDashoffset = offset;
            }
        }

        window.addEventListener('scroll', updateProgress);
        progressWrap.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        updateProgress();
    }

    // --- SCROLL REVEAL (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    // 5. INITIALIZE 3D BACKGROUND (If present)
    if (typeof init === 'function') {
        // init() is defined in background.js
        try {
            init();
        } catch (e) {
            console.warn("Three.js background failed to init:", e);
        }
    }
});
