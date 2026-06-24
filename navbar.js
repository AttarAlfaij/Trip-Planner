/**
 * navbar.js  –  Global Shared Navbar Component
 * Safe Trip Planner
 *
 * Usage: Add this ONE line at the top of <body> on every page:
 *   <script src="/navbar.js"></script>
 *
 * The script:
 *  1. Injects the navbar HTML before all other body content
 *  2. Marks the active nav link based on the current URL
 *  3. Shows the user email + Logout button when logged in,
 *     or a Login link when not
 *  4. Provides language switcher dropdown
 */
(function () {
    // ── 1. NAV LINKS (no Contact — it lives in the footer) ──────────
    const links = [
        { labelKey: "home",      label: "Home",      href: "/index.html",    match: ["/index.html", "/"] },
        { labelKey: "about",     label: "About",     href: "/about.html",    match: ["/about.html"] },
        { labelKey: "plan_trip", label: "Plan Trip", href: "/plan-trip.html", match: ["/plan-trip.html"] },
        { labelKey: "my_trip",   label: "My Trip",   href: "/my-trip.html",   match: ["/my-trip.html"] },
    ];

    const path = window.location.pathname;

    // Build nav link HTML
    const linksHTML = links.map(function (link) {
        const isActive = link.match.some(function (m) { return path === m || path.endsWith(m); });
        return '<a href="' + link.href + '" data-i18n="' + link.labelKey + '"' + (isActive ? ' class="stp-active"' : '') + '>' + link.label + '</a>';
    }).join("");

    // ── 2. AUTH STATE ────────────────────────────────────────────────
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");

    let authHTML;
    if (token && email) {
        const initial = email.charAt(0).toUpperCase();
        authHTML =
            '<div class="stp-user-chip">' +
                '<div class="stp-user-avatar">' + initial + '</div>' +
                '<span>' + email + '</span>' +
            '</div>' +
            '<button class="stp-btn-logout" id="stp-logout-btn" data-i18n="logout">Logout</button>';
    } else {
        authHTML = '<a href="/login.html" class="stp-login-link" data-i18n="login">Login</a>';
    }

    // ── 3. LANGUAGE SWITCHER ────────────────────────────────────────
    const currentLang = localStorage.getItem("appLanguage") || "en";
    const langSwitcherHTML =
        '<div class="stp-lang-switcher">' +
            '<select id="lang-switcher" class="stp-lang-select" title="Select Language">' +
                '<option value="en"' + (currentLang === 'en' ? ' selected' : '') + '>English</option>' +
                '<option value="hi"' + (currentLang === 'hi' ? ' selected' : '') + '>हिंदी</option>' +
                '<option value="zh"' + (currentLang === 'zh' ? ' selected' : '') + '>中文</option>' +
            '</select>' +
        '</div>';

    // ── 4. INJECT NAVBAR HTML ────────────────────────────────────────
    const navbarHTML =
        '<header class="stp-header">' +
            '<div class="stp-header-inner">' +
                '<a href="/index.html" class="stp-logo">' +
                    '<div class="stp-logo-mark">ST</div>' +
                    '<div class="stp-logo-text">' +
                        '<span class="stp-logo-main">Safe Trip Planner</span>' +
                        '<span class="stp-logo-sub" data-i18n="logo_sub">Plan smart · travel safe</span>' +
                    '</div>' +
                '</a>' +
                '<nav class="stp-nav" aria-label="Main navigation">' +
                    linksHTML +
                '</nav>' +
                '<div class="stp-nav-actions">' +
                    langSwitcherHTML +
                    '<div class="stp-nav-auth">' +
                        authHTML +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</header>';

    // Insert as the very first element in <body>
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // ── 5. LANGUAGE SWITCHER HANDLER ──────────────────────────────────
    const langSelect = document.getElementById("lang-switcher");
    if (langSelect) {
        langSelect.addEventListener("change", function () {
            const selectedLang = this.value;
            localStorage.setItem("appLanguage", selectedLang);
            // Reload page to apply new language
            window.location.reload();
        });
    }

    // ── 6. LOGOUT HANDLER ────────────────────────────────────────────
    const logoutBtn = document.getElementById("stp-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            const t = localStorage.getItem("authToken");
            if (t) {
                fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + t }
                }).catch(function () {});
            }
            localStorage.removeItem("authToken");
            localStorage.removeItem("userEmail");
            window.location.replace("/login.html");
        });
    }
})();
