document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 0. LOADER HANDLING
    // -------------------------------------------------------------------------
    // Use window 'load' for full assets, or run small timeout for effect
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            // Slight delay to ensure animation is seen at least briefly
            setTimeout(() => {
                loader.classList.add('loaded');
                // Optional: Remove from DOM after transition to free memory
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500); // Match CSS transition duration
            }, 1500); // Increased view time
        });
    }

    // -------------------------------------------------------------------------
    // 1. DYNAMIC CONTACT LINKS (Gmail & WhatsApp)
    // -------------------------------------------------------------------------
    function initContactLinks() {
        const EMAIL = 'benabdellah.mosab@etu.uae.ac.ma';
        const PHONE_WA = '212602504704';

        const DEFAULT_MSG = 'Bonjour Mosab, je vous contacte suite à votre portfolio.';
        const EMAIL_SUBJECT = 'Contact via portfolio';

        const waUrl = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(DEFAULT_MSG)}`;
        // Note: RFC 6068 suggests manual encoding for mailto but encodeURIComponent usually works well in modern browsers.
        // We ensure spaces/chars are clean.
        const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(DEFAULT_MSG)}`;

        const waLink = document.getElementById('waLink');
        const gmailLink = document.getElementById('gmailLink');

        if (waLink) waLink.href = waUrl;
        if (gmailLink) gmailLink.href = mailtoUrl;
    }
    initContactLinks();

    // -------------------------------------------------------------------------
    // 1.1 NAVBAR INDICATOR (Sliding Light Beam)
    // -------------------------------------------------------------------------
    const navIndicator = document.querySelector('.nav-indicator');
    const navLinksList = document.querySelectorAll('.nav-links li a');

    function moveIndicator(el) {
        if (!navIndicator || !el) return;

        // Calculate position relative to the UL parent
        // The .nav-links UL is relative, so offsetLeft gives position inside it
        navIndicator.style.width = `${el.offsetWidth}px`;
        navIndicator.style.left = `${el.offsetLeft}px`;
        navIndicator.style.opacity = '1';
    }

    function resetIndicator() {
        if (!navIndicator) return;
        navIndicator.style.opacity = '0';
        // Optional: Move back to active link if you want persistence
        // const active = document.querySelector('.nav-link.active');
        // if(active) moveIndicator(active);
    }

    navLinksList.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            moveIndicator(e.target);
        });
    });

    // Hide when leaving the UL area
    const navUl = document.querySelector('.nav-links');
    if (navUl) {
        navUl.addEventListener('mouseleave', resetIndicator);
    }

    // -------------------------------------------------------------------------
    // 2. THEME HANDLING (Auto / Light / Dark)
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    // States: 'auto' (null) | 'light' | 'dark'
    // Default on refresh: Auto (null)
    // Toggle Cycle: 
    //   - If currently Auto(Dark) -> Click -> Light
    //   - If currently Auto(Light) -> Click -> Dark
    //   - If currently Dark -> Click -> Light
    //   - If currently Light -> Click -> Dark
    // effectively: Always toggle to the *other* visual state.

    let preferredMode = null; // Default to Auto on page load

    // Remove any persisted keys from previous versions to ensure clean slate
    localStorage.removeItem('theme');
    localStorage.removeItem('app_theme_pref');

    function getPreferredTheme() {
        if (preferredMode) return preferredMode;
        return mq.matches ? 'dark' : 'light'; // System Default
    }

    function applyTheme() {
        // Visual theme is either override or system
        const visualTheme = getPreferredTheme();

        // 1. Apply data-theme
        if (preferredMode) {
            root.setAttribute('data-theme', preferredMode);
        } else {
            root.removeAttribute('data-theme');
        }

        // 2. Update Assets
        updateThemeAssets(visualTheme);

        // 3. Update Toggle Icon
        // Always show the icon for the "Opposite" or "Current" state?
        // Standard: If I am in Dark mode, show Sun (to switch to Light).
        //           If I am in Light mode, show Moon (to switch to Dark).
        updateToggleIcon(visualTheme);
    }

    function updateThemeAssets(visualTheme) {
        const brandLogo = document.getElementById('brandLogo');
        if (brandLogo) {
            brandLogo.src = visualTheme === 'dark'
                ? 'assets/logo-mba-dark.png'
                : 'assets/logo-mba-light.png';
        }

        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = visualTheme === 'dark'
                ? 'assets/logo-mba-dark.png'
                : 'assets/logo-mba-light.png';
        }
    }

    function updateToggleIcon(visualTheme) {
        const svg = themeToggleBtn.querySelector('svg');
        const modeLabel = visualTheme === 'light' ? 'Light' : 'Dark';

        themeToggleBtn.setAttribute('aria-label', `Current theme: ${modeLabel}. Click to switch.`);
        themeToggleBtn.title = `Current Mode: ${modeLabel} (System: ${mq.matches ? 'Dark' : 'Light'})`;

        if (visualTheme === 'light') {
            // Unconditionally show Moon (to switch to Dark)
            svg.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        } else {
            // Unconditionally show Sun (to switch to Light)
            svg.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }

    // Toggle logic: Simple 2-state flip based on CURRENT VISUAL state
    themeToggleBtn.addEventListener('click', () => {
        const currentVisual = getPreferredTheme();
        if (currentVisual === 'light') {
            preferredMode = 'dark';
        } else {
            preferredMode = 'light';
        }
        applyTheme();
    });

    // Listen for System Changes
    mq.addEventListener('change', () => {
        // Only re-apply if we are in Auto mode (preferredMode is null)
        if (!preferredMode) {
            applyTheme();
        }
    });

    // Initialize
    applyTheme();


    // -------------------------------------------------------------------------
    // 3. MOBILE MENU
    // -------------------------------------------------------------------------
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = mobileNavOverlay.querySelectorAll('.nav-link');

    function toggleMenu() {
        mobileNavOverlay.classList.toggle('active');
        const isExpanded = mobileNavOverlay.classList.contains('active');
        burgerMenu.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    burgerMenu.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) toggleMenu();
        });
    });

    // -------------------------------------------------------------------------
    // 4. SCROLL REVEAL ANIMATION
    // -------------------------------------------------------------------------
    const observerOptions = { root: null, threshold: 0.1, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden-scroll').forEach(el => observer.observe(el));

    // -------------------------------------------------------------------------
    // 5. SMOOTH SCROLL
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
});
