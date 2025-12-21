document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 0. CUSTOM LOGO PRELOADER
    // -------------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.add('loaded'); // Enable scroll if needed
            }, 600);
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
    // 2. THEME HANDLING (Auto / Light / Dark)
    // -------------------------------------------------------------------------
    const toggleCheckbox = document.getElementById('checkbox'); // The new input
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    // States: 'auto' (null) | 'light' | 'dark'
    // Default on refresh: Auto (null)

    let preferredMode = null;

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

        // 3. Sync Checkbox with Visual State
        if (toggleCheckbox) {
            toggleCheckbox.checked = (visualTheme === 'dark');
        }
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

    // Toggle logic: Watch the checkbox change
    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                preferredMode = 'dark';
            } else {
                preferredMode = 'light';
            }
            applyTheme();
        });
    }

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
    // 5. FAKE PAGE TRANSITION (Loader on Nav Click)
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // 5. PAGE TRANSITION (Loader on Nav Click)
    // -------------------------------------------------------------------------
    // Select all links that are internal navigation
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetUrl = this.getAttribute('href');

            // checks to ignore:
            // 1. Links starting with # (anchors)
            // 2. Empty links
            // 3. mailto, tel, javascript:
            // 4. External links target="_blank"
            if (!targetUrl ||
                targetUrl.startsWith('#') ||
                targetUrl.startsWith('mailto:') ||
                targetUrl.startsWith('tel:') ||
                targetUrl.startsWith('javascript:') ||
                this.target === '_blank') {
                return;
            }

            e.preventDefault();

            // Trigger Preloader
            if (preloader) {
                preloader.classList.remove('loaded');
                document.body.classList.remove('loaded');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 50); // 50ms "Loading" time
            } else {
                window.location.href = targetUrl;
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. SLIDING NAVBAR INDICATOR (Modern Neon)
    // -------------------------------------------------------------------------
    const desktopNavList = document.querySelector('.nav-links');
    const indicator = document.querySelector('.nav-indicator');
    const desktopLinks = document.querySelectorAll('.nav-links .nav-link');

    if (indicator && desktopNavList) {
        function moveIndicator(element) {
            // Get coordinates relative to the parent UL
            const parentRect = desktopNavList.getBoundingClientRect();
            const elRect = element.getBoundingClientRect();

            const left = elRect.left - parentRect.left;
            const width = elRect.width;

            indicator.style.width = `${width}px`;
            indicator.style.transform = `translateX(${left}px)`;
            indicator.style.opacity = '1';
        }

        function resetIndicator() {
            // Check for active link
            const activeLink = document.querySelector('.nav-links .nav-link.active');
            if (activeLink) {
                moveIndicator(activeLink);
            } else {
                indicator.style.opacity = '0'; // Hide if no active link
            }
        }

        // Initialize position on load
        setTimeout(resetIndicator, 100);

        desktopLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                moveIndicator(e.target);
            });

            link.addEventListener('click', (e) => {
                // Remove active from all
                desktopLinks.forEach(l => l.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                moveIndicator(e.target);
            });
        });

        desktopNavList.addEventListener('mouseleave', resetIndicator);

        // Update on resize
        window.addEventListener('resize', resetIndicator);
    }

    // -------------------------------------------------------------------------
    // 7. SCROLL PROGRESS BUTTON
    // -------------------------------------------------------------------------
    const progressPath = document.querySelector('.progress-wrap path');
    const progressWrap = document.querySelector('.progress-wrap');

    if (progressPath && progressWrap) {
        const pathLength = progressPath.getTotalLength();

        // Initialize Stroke
        progressPath.style.transition = 'none';
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect(); // Trigger layout
        progressPath.style.transition = 'stroke-dashoffset 10ms linear';

        const updateProgress = () => {
            const scroll = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;

            // Show/Hide Button
            if (scroll > 50) {
                progressWrap.classList.add('active-progress');
            } else {
                progressWrap.classList.remove('active-progress');
            }
        };

        window.addEventListener('scroll', updateProgress);

        // Click to Scroll Top
        progressWrap.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // -------------------------------------------------------------------------
    // 8. SITE PROTECTION (Anti-Theft)
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // 8. SECURITY SYSTEM (Code: RED-1000)
    // -------------------------------------------------------------------------
    (function (_0x1a2b) {
        // ALLOWED DOMAINS
        const _0x3c4d = ['mbasite.netlify.app', 'mbasite.vercel.app', 'localhost', '127.0.0.1'];
        const _0x5e6f = window.location.hostname;

        // 1. DOMAIN LOCK (Kill Switch)
        let _0x7g8h = false;
        for (let _0x9i0j of _0x3c4d) {
            if (_0x5e6f.includes(_0x9i0j)) {
                _0x7g8h = true;
                break;
            }
        }

        if (!_0x7g8h) {
            // UNAUTHORIZED HOST DETECTED
            let msg = '<h1>ACCESS DENIED 🛑</h1>';
            if (_0x5e6f === '') {
                msg += '<p><strong>Security Restriction:</strong> You are opening the file directly (file://).<br>To test your site securely, please use the Local Server.</p>';
                msg += '<p>👉 Open this link instead: <a href="http://localhost:8080">http://localhost:8080</a></p>';
            } else {
                msg += '<p>Running on unauthorized domain: ' + _0x5e6f + '</p>';
            }
            document.documentElement.innerHTML = '<div style="font-family:sans-serif; text-align:center; padding-top:50px;">' + msg + '</div>';
            throw new Error('Security Violation');
        }

        // 2. REVEAL CONTENT (only if safe)
        // We assume CSS hid the body. Now we show it.
        document.documentElement.style.display = 'block';

        // 3. DEBUGGER TRAP (Anti-DevTools) - DISABLED ON LOCALHOST
        const _0xisLocal = _0x5e6f.includes('localhost') || _0x5e6f.includes('127.0.0.1');
        if (!_0xisLocal) {
            setInterval(function () {
                const _0x1k2l = new Date();
                debugger; // BREAKPOINT LOOP
                const _0x3m4n = new Date();
                if (_0x3m4n - _0x1k2l > 100) {
                    // Console is likely open
                    document.body.innerHTML = '<h1>Don\'t look at the code!</h1>';
                }
            }, 1000);
        }

        // 4. DISABLE INTERACTION
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.keyCode == 123) { // 123 = F12
                e.preventDefault();
                return false;
            }
        });

        // 5. BANNER
        console.clear();
        console.log('%cSECURE MODE', 'color:green; font-size:20px; font-weight:bold;');

    })();
});

