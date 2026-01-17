
document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER (Robust Removal with Minimum Display Time)
    const preloader = document.getElementById('preloader');
    const minDisplayTime = 500; // Minimum time in ms to show loader
    const startTime = Date.now();

    const removePreloader = () => {
        if (preloader && preloader.style.display !== 'none') {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500); // Fade out duration matches CSS transition usually
            }, remainingTime);
        }
    };

    // Remove on window load (all assets loaded)
    window.addEventListener('load', removePreloader);

    // Fallback timeout (3 second safety - slightly longer to ensure min display)
    setTimeout(removePreloader, 3000);

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

    // --- SCROLL PROGRESS (High Performance & Robust) ---
    const progressWrap = document.getElementById('progressWrap');
    if (progressWrap) {
        const path = progressWrap.querySelector('path');
        const pathLength = 307.919; // Radius 49px * 2 * PI

        // 1. Setup Initial State (Start Empty)
        if (path) {
            path.style.transition = 'none';
            path.style.strokeDasharray = `${pathLength}px ${pathLength}px`;
            path.style.strokeDashoffset = `${pathLength}px`;
            path.getBoundingClientRect(); // Force Reflow
            path.style.transition = 'stroke-dashoffset 10ms linear';
        }

        let ticking = false;

        const updateProgress = () => {
            // Get Scroll Top (Cross-browser)
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

            // Get Scroll Height & Client Height (Cross-browser)
            const scrollHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );

            const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            const scrollableHeight = scrollHeight - clientHeight;

            // Calculate Progress (0.0 to 1.0) with Clamp
            const progress = Math.max(0, Math.min(1, scrollTop / scrollableHeight));

            // Calculate Offset: Empty (pathLength) -> Full (0)
            const offset = pathLength - (pathLength * progress);

            if (path) {
                path.style.strokeDashoffset = `${offset}px`;
            }

            // Update Visibility (> 50px)
            if (scrollTop > 50) {
                progressWrap.classList.add('active-progress');
            } else {
                progressWrap.classList.remove('active-progress');
            }

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        // Attach Listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateProgress);

        progressWrap.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Initial Calculation
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
